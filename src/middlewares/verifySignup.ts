import User from '../models/user.model'
import { Request, Response, NextFunction } from 'express'

export const checkDuplicateUsernameOrEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { username, email } = req.body

  const duplicateUsername = await User.findOne({ username }).exec()
  const duplicateEmail = await User.findOne({ email }).exec()

  if (duplicateUsername) {
    return res.status(400).json({ message: 'The user already exists' })
  }

  if (duplicateEmail) {
    return res.status(400).json({ message: 'The email already exists' })
  }

  next()
}
