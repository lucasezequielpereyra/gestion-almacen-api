import User from '../models/user.model'
import Role from '../models/role.model'
import bcrypt from 'bcryptjs'
import logger from '../config/logger'
import { Request, Response } from 'express'

const handleNewUser = async (req: Request, res: Response) => {
  const { username, password, email } = req.body
  if (!username || !password)
    return res.status(400).json({ error: 'Missing user or password' })

  try {
    // find default user role
    const defaultRole = await Role.findOne({ name: 'user' }).exec()

    // create new user
    const newUser = new User({
      username: username,
      password: password,
      email: email,
      roles: [defaultRole?._id]
    })

    // save user to database
    const savedUser = await newUser.save()

    // return user
    return res.status(201).json(`User ${savedUser.username} created`)
  } catch (err) {
    logger.error.error(err)
    res.status(500).json({ error: err })
  }
}

export default {
  handleNewUser
}
