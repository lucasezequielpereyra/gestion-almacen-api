import Product from '../models/product.model'
import { Request, Response, NextFunction } from 'express'

export const checkDuplicateProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { sku, EAN } = req.body
  const { id } = req.params

  const searchBySku = await Product.find({ sku: sku }).exec()

  if (searchBySku.length > 0) {
    if (id !== searchBySku[0]._id.toString()) {
      return res.status(400).json({ error: 'Este SKU ya existe' })
    }
  }

  next()
}
