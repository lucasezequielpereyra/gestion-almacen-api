import Sale from '../models/sale.model'
import { ISale } from '../interfaces/sale.interface'
import logger from '../config/logger'
import { IOrganization } from '../interfaces/organization.interface'
import { IUser } from '../interfaces/user.interface'
import User from '../models/user.model'
import { Request, Response } from 'express'

const handleNewSale = async (req: Request, res: Response) => {
  const { username, organization, products, method, total } = req.body

  if (!username || !organization || !products || !method || !total) {
    return res.status(400).json({ message: 'Missing fields' })
  }

  try {
    const userData: IUser | null = await User.findOne({ username: username })

    if (!userData) {
      return res.status(404).json({ message: 'User not found' })
    }

    const newSale = new Sale({
      user: userData._id,
      organization: organization?._id,
      products: products,
      method: method,
      total: total
    })

    const saleSaved: ISale = await newSale.save()

    return res.status(201).json({ newSale: saleSaved })
  } catch (error) {
    logger.error.error(error)
    return res.status(500).json({ message: 'Internal server error' })
  }
}

export default {
  handleNewSale
}
