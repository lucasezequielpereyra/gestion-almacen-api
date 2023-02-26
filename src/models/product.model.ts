import { Schema, model } from 'mongoose'
import { IProduct } from '../interfaces/product.interface'

const productSchema = new Schema({
    sku: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    category: {
        ref: 'Category',
        type: Schema.Types.ObjectId
    },
    description: {
        type: String,
        required: true
    },
    EAN: {
        type: String,
    },
    price_cost: {
        type: Number,
        required: true
    },
    price_sale: {
        type: Number,
    },
    stock: {
        type: Number,
    }
})

const ProductModel = model<IProduct>('Product', productSchema)

export default ProductModel