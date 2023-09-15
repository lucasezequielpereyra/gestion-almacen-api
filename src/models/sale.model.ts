import { Schema, model } from 'mongoose'
import { ISale } from '../interfaces/sale.interface'

const saleSchema = new Schema(
  {
    user: {
      ref: 'User',
      type: Schema.Types.ObjectId,
      required: true
    },
    organization: {
      ref: 'Organization',
      type: Schema.Types.ObjectId,
      required: true
    },
    products: [
      {
        product: {
          ref: 'Product',
          type: Schema.Types.ObjectId
        },
        quantity: {
          type: Number,
          required: true
        }
      }
    ],
    method: {
      type: String,
      required: true
    },
    total: {
      type: Number,
      required: true
    },
    deleted: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
)

const SaleModel = model<ISale>('Sale', saleSchema)

export default SaleModel
