import { Schema, model } from 'mongoose'
import { ICategory } from '../interfaces/category.interface'

const categorySchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    organization: {
        ref: 'Organization',
        type: Schema.Types.ObjectId,
        required: true
    },
    deleted: {
        type: Boolean,
        default: false
    }
})

const CategoryModel = model<ICategory>('Category', categorySchema)

export default CategoryModel