import { ObjectId } from 'mongoose'
import { IProduct } from './product.interface'

export interface IOrganization {
  _id: ObjectId
  name: string
  employees: ObjectId[]
  products: ObjectId[]
}