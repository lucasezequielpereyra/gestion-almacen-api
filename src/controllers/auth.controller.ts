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

    // Create JWT Payload
    const accessToken = jwt.sign(
      {
        UserInfo: {
          username: foundUser.username,
          roles: roles
        }
      },
      JWT_SECRET,
      { expiresIn: '10s' }
    )

    logger.info.info(`access token: ${accessToken}`)

    const newRefreshToken = jwt.sign(
      { username: foundUser.username },
      JWT_REFRESH_SECRET,
      { expiresIn: '1d' }
    )

    logger.info.info(`refresh token: ${newRefreshToken}`)

    // Changed to let keyword
    let newRefreshTokenArray = !cookies?.jwt
      ? foundUser.refreshToken
      : foundUser.refreshToken.filter(rt => rt !== cookies.jwt)

    if (cookies?.jwt) {
      logger.info.info(`refresh token from cookie: ${cookies.jwt}`)
      const refreshToken = cookies.jwt
      const foundToken = await User.findOne({ refreshToken })

      logger.info.info(`found token: ${foundToken}`)

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
    res.status(200).json({ roles, accessToken })
  } catch (error) {
    logger.error.error(error)
    res.status(500).json({ message: 'Server Error' })
  }
}

export default handleLogin
