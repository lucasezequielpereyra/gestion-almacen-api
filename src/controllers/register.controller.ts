import User from '../models/user.model'
import Role from '../models/role.model'
import bcrypt from 'bcryptjs'
import logger from '../config/logger'
import { Request, Response } from 'express'

const handleNewUser = async (req: Request, res: Response) => {
  const { user, password } = req.body
  if (!user || !password)
    return res.status(400).json({ error: 'Missing user or password' })

  try {
    // encrypt password
    const hashedPassword = await bcrypt.hash(password, 10)

    // find default user role
    const defaultRole = await Role.findOne({ name: 'user' }).exec()

    // create new user
    const newUser = new User({
      username: user,
      password: hashedPassword,
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
