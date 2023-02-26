import User from '../models/user.model'
import jwt from 'jsonwebtoken'
import logger from '../config/logger'
import { Request, Response } from 'express'

const JWT_REFRESH_SECRET: string = process.env.REFRESH_TOKEN_SECRET || 'secret'
const JWT_TOKEN_SECRET: string = process.env.ACCESS_TOKEN_SECRET || 'secret'

const handleRefreshToken = async (req: Request, res: Response) => {
  const cookies = req.cookies
  if (!cookies?.jwt) return res.sendStatus(401) // 401: Unauthorized

  const refreshToken = cookies.jwt
  res.clearCookie('jwt', { httpOnly: true, sameSite: 'none', secure: true })

  try {
    const foundUser = await User.findOne({ refreshToken }).exec()

    // Detected refresh token reuse
    if (foundUser === null) {
      jwt.verify(
        refreshToken,
        JWT_REFRESH_SECRET,
        async (err: any, decoded: any) => {
          if (err) return res.sendStatus(403) //Forbidden
          const hackedUser = await User.findOne({
            username: decoded.username
          }).exec()
          if (hackedUser) {
            hackedUser.refreshToken = []
            await hackedUser.save()
          }
        }
      )
      return res.sendStatus(403) //Forbidden
    }

    const newRefreshTokenArray = foundUser.refreshToken.filter(
      rt => rt !== refreshToken
    )

    // Evaluate jwt
    jwt.verify(
      refreshToken,
      JWT_REFRESH_SECRET,
      async (err: any, decoded: any) => {
        if (err) {
          logger.error.error('expired refresh token')
          foundUser.refreshToken = [...newRefreshTokenArray]
          await foundUser.save()
        }

        if (err || foundUser.username !== decoded.username)
          return res.sendStatus(403)

        // Refresh token was still valid
        const roles = Object.values(foundUser.roles)

        const accessToken = jwt.sign(
          {
            UserInfo: {
              username: foundUser.username,
              roles: roles
            }
          },
          JWT_TOKEN_SECRET,
          { expiresIn: '15m' }
        )

        const newRefreshToken = jwt.sign(
          {
            username: foundUser.username
          },
          JWT_REFRESH_SECRET,
          { expiresIn: '1d' }
        )
        // Saving refreshToken with current user
        foundUser.refreshToken = [...newRefreshTokenArray, newRefreshToken]
        await foundUser.save()

        // Create Secure Cookie with refresh token
        res.cookie('jwt', newRefreshToken, {
          httpOnly: true,
          secure: true,
          sameSite: 'none',
          maxAge: 24 * 60 * 60 * 1000
        })

        const username = foundUser.username

        res.json({ accessToken, username })
      }
    )
  } catch (error) {
    logger.error.error(error)
    return res.sendStatus(500)
  }
}

export default handleRefreshToken
