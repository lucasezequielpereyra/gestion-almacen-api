import Sale from '../models/sale.model'
import { ISale } from '../interfaces/sale.interface'
import logger from '../config/logger'
import { IOrganization } from '../interfaces/organization.interface'
import { IUser } from '../interfaces/user.interface'
import { Request, Response } from 'express'

const handleNewSale = async (req: Request, res: Response) => {
  const { user, organization, products, method, total } = req.body

  console.log(req.body)
}

export default {
  handleNewSale
}
