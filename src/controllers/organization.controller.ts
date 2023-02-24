import { IOrganization } from './../interfaces/organization.interface'
import { IUser } from '../interfaces/user.interface'
import Organization from '../models/organization.model'
import User from '../models/user.model'
import logger from '../config/logger'
import { Request, Response } from 'express'

const handleNewOrganization = async (req: Request, res: Response) => {
  const { name } = req.body
  if (!name) return res.status(400).json({ error: 'Missing name' })

  try {
    // create new organization
    const newOrganization = new Organization({
      name: name
    })

    // save organization to database
    const savedOrganization = await newOrganization.save()

    // return organization
    return res
      .status(201)
      .json(`Organization ${savedOrganization.name} created`)
  } catch (err) {
    logger.error.error(err)
    res.status(500).json({ error: err })
  }
}

const handleNewEmployee = async (req: Request, res: Response) => {
  const { organization, user } = req.body
  if (!organization)
    return res.status(400).json({ error: 'Missing organization' })
  if (!user) return res.status(400).json({ error: 'Missing user' })

  try {
    const dataOrg: IOrganization | null = await Organization.findOne({
      name: organization
    }).exec()
    if (!dataOrg)
      return res.status(400).json({ error: 'Organization not found' })

    const dataUser: IUser | null = await User.findOne({ username: user }).exec()
    if (!dataUser) return res.status(400).json({ error: 'User not found' })

    const employeeInOrg = dataOrg.employees.filter(
      employee => employee.toString() === dataUser._id.toString()
    )

    if (employeeInOrg?.length > 0)
      return res.status(400).json({ error: 'User already in org' })

    await Organization.findOneAndUpdate(dataOrg._id, {
      $push: { employees: dataUser._id }
    })

    res.status(201).json(`User ${dataUser.username} added to ${dataOrg.name}`)
  } catch (error) {
    logger.error.error(error)
    res.status(500).json({ error: error })
  }
}

export default {
  handleNewOrganization,
  handleNewEmployee
}
