import User from '../models/user.model'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { Request, Response } from 'express'
import logger from '../config/logger'

const JWT_SECRET: string = process.env.ACCESS_TOKEN_SECRET || 'secret'
const JWT_REFRESH_SECRET: string = process.env.REFRESH_TOKEN_SECRET || 'secret'

const handleLogin = async (req: Request, res: Response) => {
  const cookies = req.cookies

  const { username, password } = req.body

  if (!username || !password) {
    return res.status(400).json({ message: 'Please enter all fields' })
  }

  try {
    const foundUser = await User.findOne({ username })
    if (!foundUser) return res.sendStatus(401) // 401: Unauthorized

    const isMatch = await bcrypt.compare(password, foundUser.password)
    if (!isMatch) return res.sendStatus(401) // 401: Unauthorized

    const roles = Object.values(foundUser.roles).filter(Boolean)

    // capture organization for response
    const organization = foundUser.organization || null

    // Create JWT Payload
    const accessToken = jwt.sign(
      {
        UserInfo: {
          username: foundUser.username,
          roles: roles,
          organization: organization
        }
      },
      JWT_SECRET,
      { expiresIn: '15m' }
    )

    const newRefreshToken = jwt.sign(
      { username: foundUser.username },
      JWT_REFRESH_SECRET,
      { expiresIn: '1d' }
    )

    // Changed to let keyword
    let newRefreshTokenArray = !cookies?.jwt
      ? foundUser.refreshToken
      : foundUser.refreshToken.filter(rt => rt !== cookies.jwt)

    if (cookies?.jwt) {
      const refreshToken = cookies.jwt
      const foundToken = await User.findOne({ refreshToken })

      // Detected refresh token reuse
      if (foundToken === null) {
        // Clear out all previous refresh tokens
        newRefreshTokenArray = []
      }
      res.clearCookie('jwt', { httpOnly: true, sameSite: 'none', secure: true })
    }

    // Saving refreshToken with current user
    foundUser.refreshToken = [...newRefreshTokenArray, newRefreshToken]

    await foundUser.save()

    // Create Secure Cookie
    res.cookie('jwt', newRefreshToken, {
      httpOnly: true,
      sameSite: 'none',
      secure: true
    })

    // Send auth token
    res.status(200).json({ accessToken, username, roles, organization })
  } catch (error) {
    logger.error.error(error)
    res.status(500).json({ message: 'Server Error' })
  }
}

const handleLogout = async (req: Request, res: Response) => {
  const cookies = req.cookies
  if (!cookies?.jwt) return res.sendStatus(204) //No content
  const refreshToken = cookies.jwt

  // refresh token in db?
  const foundUser = await User.findOne({ refreshToken }).exec()
  if (!foundUser) {
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'none', secure: true })
    return res.sendStatus(204)
  }

  // Delete refreshToken in db
  foundUser.refreshToken = foundUser.refreshToken.filter(
    rt => rt !== refreshToken
  )
  await foundUser.save()

  res.clearCookie('jwt', { httpOnly: true, sameSite: 'none', secure: true })
  res.sendStatus(204)
}

export default {
  handleLogin,
  handleLogout
}
