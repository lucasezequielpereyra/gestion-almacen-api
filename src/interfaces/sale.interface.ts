import { ObjectId } from 'mongoose'

export type MethodSale = 'efectivo' | 'tarjeta' | 'digital'

export interface ISale {
  _id: ObjectId
  user: ObjectId
  organization: ObjectId
  products: ObjectId[]
  method: MethodSale
  total: number
  deleted: boolean
}
