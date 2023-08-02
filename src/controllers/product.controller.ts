import Product from '../models/product.model'
import Category from '../models/category.model'
import Organization from '../models/organization.model'
import logger from '../config/logger'
import { Request, Response } from 'express'

const handleNewProduct = async (req: Request, res: Response) => {
  const {
    sku,
    name,
    category,
    description,
    EAN,
    price_cost,
    price_sale = '0',
    stock = '0',
    organization
  } = req.body

  if (!sku) return res.status(400).json({ error: 'Missing sku' })
  if (!name) return res.status(400).json({ error: 'Missing name' })
  if (!category) return res.status(400).json({ error: 'Missing category' })
  if (!description)
    return res.status(400).json({ error: 'Missing description' })
  if (!EAN) return res.status(400).json({ error: 'Missing EAN' })
  if (!price_cost) return res.status(400).json({ error: 'Missing price_cost' })
  if (!organization)
    return res.status(400).json({ error: 'Missing organization' })

  try {
    const foundCategory = await Category.findOne({ name: category })
    if (!foundCategory)
      return res.status(400).json({ error: 'Category not found' })

    const newProduct = new Product({
      sku: sku,
      name: name,
      category: foundCategory,
      description: description,
      EAN: EAN,
      price_cost: price_cost,
      price_sale: price_sale,
      stock: stock,
      organization: organization
    })

    const savedProduct = await newProduct.save()

    return res
      .status(201)
      .json({ message: `Product ${savedProduct.name} created`, savedProduct })
  } catch (err) {
    logger.error.error(err)
    res.status(500).json({ error: err })
  }
}

const getProductsByOrganization = async (req: Request, res: Response) => {
  const { organization } = req.body
  if (!organization)
    return res.status(400).json({ error: 'Missing organization' })

  try {
    const foundOrganization = await Organization.findOne({ _id: organization })
    if (!foundOrganization)
      return res.status(400).json({ error: 'Organization not found' })

    const foundProducts = await Product.find({
      organization: foundOrganization,
      deleted: false
    })
      .populate('category')
      .sort({ sku: 1 })
    if (!foundProducts)
      return res.status(400).json({ error: 'Products not found' })

    return res.status(200).json({ foundProducts })
  } catch (error) {
    logger.error.error(error)
    res.status(500).json({ error: error })
  }
}

const handleUpdateProduct = async (req: Request, res: Response) => {
  const {
    sku,
    name,
    category,
    description,
    EAN,
    price_cost,
    price_sale,
    stock,
    organization
  } = req.body

  try {
    const foundProduct = await Product.findOne({ sku: sku })
    if (!foundProduct)
      return res.status(404).json({ error: 'Product not found' })

    const foundCategory = await Category.findOne({ name: category })
    if (!foundCategory)
      return res.status(400).json({ error: 'Category not found' })

    const updateProduct = await Product.findOneAndUpdate(
      { _id: foundProduct._id },
      {
        sku: sku || foundProduct.sku,
        name: name || foundProduct.name,
        category: foundCategory || foundProduct.category,
        description: description || foundProduct.description,
        EAN: EAN || foundProduct.EAN,
        price_cost: price_cost || foundProduct.price_cost,
        price_sale: price_sale || foundProduct.price_sale,
        stock: stock || foundProduct.stock,
        organization: organization
      },
      { new: true }
    )

    return res.status(200).json(updateProduct)
  } catch (error) {
    logger.error.error(error)
    res.status(500).json({ error: error })
  }
}

const handleDeleteProduct = async (req: Request, res: Response) => {
  const { id } = req.params

  try {
    const deleteProduct = await Product.findByIdAndDelete(id)
    if (!deleteProduct)
      return res.status(404).json({ error: 'Product not found' })

    return res.status(200).json(`Product ${deleteProduct.name} deleted`)
  } catch (error) {
    logger.error.error(error)
    res.status(500).json({ error: error })
  }
}

const handleLogicalDeleteProduct = async (req: Request, res: Response) => {
  const {id} = req.params

  try {
    const foundProduct = await Product.findOne({ _id: id })
    if (!foundProduct)
      return res.status(404).json({ error: 'Product not found' })

    foundProduct.deleted = true

    const logicalDeleteProduct = await foundProduct.save()

    return res.status(200).json(`El producto ${logicalDeleteProduct.name} fue eliminado`)
    
  } catch (error) {
    return res.status(500).json({ error: error })
  }
}

export default {
  handleNewProduct,
  getProductsByOrganization,
  handleUpdateProduct,
  handleDeleteProduct,
  handleLogicalDeleteProduct
}
