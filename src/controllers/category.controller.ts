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

const getCategoriesByOrganization = async (req: Request, res: Response) => {
    const { organization } = req.body

    if (!organization) return res.status(400).json({ message: 'Missing parameters' })

    try {
        const foundCategories = await Category.find({ organization: organization })
        if (!foundCategories) return res.status(404).json({ message: 'Categories not found' })

        return res.status(200).json({ message: 'Categories found', categories: foundCategories })
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error', error })
    }
}

const handleDeleteCategory = async (req: Request, res: Response) => {
    const { id } = req.params
    const { organization } = req.body

    if (!id) return res.status(400).json({ message: 'Missing parameters' })

    try {
        const deletedCategory = await Category.findByIdAndDelete(id)
        if (!deletedCategory) return res.status(404).json({ message: 'Category not found' })
        if (deletedCategory.organization != organization) return res.sendStatus(403)

        return res.status(200).json({ message: 'Category deleted', category: deletedCategory })
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error', error })
    }
}

export default { handleNewCategory, getCategoriesByOrganization, handleDeleteCategory }