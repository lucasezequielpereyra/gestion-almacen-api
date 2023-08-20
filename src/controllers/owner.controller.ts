import Organization from '../models/organization.model'
import { IOrganization } from '../interfaces/organization.interface'
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

export default {
  getOrgazationEmployees
}
