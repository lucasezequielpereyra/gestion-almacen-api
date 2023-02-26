import Category from '../models/category.model'
import { Request, Response } from 'express'

const handleNewCategory = async (req: Request, res: Response) => {
    const { organization, name } = req.body

    if (!organization || !name) return res.status(400).json({ message: 'Missing parameters' })

    try {
        const newCategory = new Category({
            organization: organization,
            name: name
        })

        await newCategory.save()

        return res.status(201).json({ message: 'Category created', category: newCategory })
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error', error })
    }
}

export default { handleNewCategory }