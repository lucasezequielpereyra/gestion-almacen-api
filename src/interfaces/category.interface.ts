import { ObjectId } from "mongoose"

export interface ICategory {
    _id: string
    name: string
    organization: ObjectId
    deleted: boolean
}