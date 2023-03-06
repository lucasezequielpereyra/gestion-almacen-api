import Category from '../models/category.model'
import { Request, Response, NextFunction } from 'express'

export const checkDuplicateCategories = async (req: Request, res: Response, next: NextFunction) => {
    const { name } = req.body

    try {
        const foundCategory = await Category.findOne({ name: name })
        if (foundCategory) return res.sendStatus(400)

        next()
    } catch (error) {

    }
}