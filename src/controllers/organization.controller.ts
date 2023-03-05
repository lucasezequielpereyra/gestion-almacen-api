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

const getOrganizationByEmployee = async (req: Request, res: Response) => {
  const { username } = req.body

  try {
    const dataUser: IUser | null = await User.findOne({ username: username }).exec()
    if (!dataUser) return res.status(400).json({ error: 'User not found' })

    const dataOrg: IOrganization | null = await Organization.findOne({ employees: dataUser._id }).exec()
    if (!dataOrg) return res.status(400).json({ error: 'Organization not found' })

    return res.status(200).json({ organization: dataOrg.name })
  } catch (error) {
    logger.error.error(error)
    res.sendStatus(500)
  }

}

const getOrganizations = async (req: Request, res: Response) => {
  try {
    const foundOrganizations = await Organization.find()
    if (!foundOrganizations) return res.status(404).json({ message: 'Organizations not found' })

    return res.status(200).json({ message: 'Organizations found', organizations: foundOrganizations })
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error', error })
  }
}

export default {
  handleNewOrganization,
  handleNewEmployee,
  getOrganizationByEmployee,
  getOrganizations
}
