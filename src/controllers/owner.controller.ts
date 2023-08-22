import Organization from '../models/organization.model'
import { IOrganization } from '../interfaces/organization.interface'
import User from '../models/user.model'
import { IUser } from '../interfaces/user.interface'
import Role from '../models/role.model'
import { IRole } from '../interfaces/role.interface'
import logger from '../config/logger'
import { Request, Response } from 'express'

const getOrgazationEmployees = async (req: Request, res: Response) => {
  const { organization } = req.body
  if (!organization)
    return res.status(400).json({ error: 'Missing organization' })

  try {
    const dataEmployees: IOrganization | null = await Organization.findById(
      organization
    )
      .populate('employees')
      .exec()

    if (!dataEmployees)
      return res.status(400).json({ error: 'Organization not found' })

    return res.status(200).json(dataEmployees.employees)
  } catch (error) {
    logger.error.error(error)
    return res.status(500).json({ error: error })
  }
}

const handleNewEmployee = async (req: Request, res: Response) => {
  const { organization, username, password, email, roles } = req.body
  if (!organization)
    return res.status(400).json({ error: 'Missing organization' })

  if (!username) return res.status(400).json({ error: 'Missing username' })
  if (!password) return res.status(400).json({ error: 'Missing password' })
  if (!email) return res.status(400).json({ error: 'Missing email' })
  if (!roles) return res.status(400).json({ error: 'Missing roles' })

  try {
    // get role
    const dataRoles: IRole | null = await Role.findOne({ name: roles }).exec()
    if (!dataRoles) return res.status(400).json({ error: 'Role not found' })

    const newEmployee = new User({
      username: username,
      password: password,
      email: email,
      roles: dataRoles._id,
      organization: organization._id
    })

    const savedEmployee: IUser = await newEmployee.save()

    // update org
    const updatedOrganization: IOrganization | null =
      await Organization.findOneAndUpdate(
        {
          _id: organization
        },
        {
          $push: { employees: savedEmployee._id }
        }
      ).exec()

    if (!updatedOrganization)
      return res.status(400).json({ error: 'Organization not found' })

    return res.status(201).json(`User ${savedEmployee.username} created`)
  } catch (error) {
    logger.error.error(error)
    return res.status(500).json({ error: error })
  }
}

export default {
  getOrgazationEmployees,
  handleNewEmployee
}
