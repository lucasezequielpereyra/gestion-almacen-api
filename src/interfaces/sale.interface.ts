import { ObjectId } from 'mongoose'

export type MethodSale = 'efectivo' | 'tarjeta' | 'digital'

export interface ISale {
  _id: ObjectId
  user: ObjectId
  organization: ObjectId
  products: Array<{
    product: ObjectId
    quantity: number
  }>
  method: MethodSale
  total: number
  deleted: boolean
}
