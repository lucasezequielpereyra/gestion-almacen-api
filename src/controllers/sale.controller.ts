import Sale from '../models/sale.model'
import { ISale } from '../interfaces/sale.interface'
import logger from '../config/logger'
import { IOrganization } from '../interfaces/organization.interface'
import { IUser } from '../interfaces/user.interface'
import { Request, Response } from 'express'

const handleNewSale = async (req: Request, res: Response) => {
  const { user, organization, products, method, total } = req.body

  if (!user) return res.status(400).json({ error: 'Missing user' })
  if (!organization)
    return res.status(400).json({ error: 'Missing organization' })
  if (!products) return res.status(400).json({ error: 'Missing products' })
  if (!method) return res.status(400).json({ error: 'Missing method' })
  if (!total) return res.status(400).json({ error: 'Missing total' })

  try {
    const newSale = new Sale({
      user,
      organization,
      products,
      method,
      total
    })

    const dataSale: ISale = await newSale.save()

    return res.status(200).json({ dataSale })
  } catch (error) {
    logger.error.error(error)
    return res.status(500).json({ error: error })
  }
}

export default {
  handleNewSale
}
