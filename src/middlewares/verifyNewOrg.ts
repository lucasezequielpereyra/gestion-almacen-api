import Organization from '../models/organization.model'
import { Request, Response, NextFunction } from 'express'

export const checkDuplicateOrganizationName = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name } = req.body

  const duplicateName = await Organization.findOne({ name }).exec()

  if (duplicateName) {
    return res.status(400).json({ message: 'The organization already exists' })
  }

  next()
}
