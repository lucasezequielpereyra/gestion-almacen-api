import { ObjectId } from "mongoose"

export interface IProduct {
    _id: string
    sku: number
    name: string
    category: ObjectId
    description: string
    EAN: string
    price_cost: number
    price_sale: number
    stock: number
    organization: ObjectId
    deleted: boolean
}