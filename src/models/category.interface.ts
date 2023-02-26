import { Schema, model } from 'mongoose'
import { ICategory } from '../interfaces/category.interface'

const categorySchema = new Schema({
    name: {
        type: String,
        required: true
    }
})

const CategoryModel = model<ICategory>('Category', categorySchema)

export default CategoryModel