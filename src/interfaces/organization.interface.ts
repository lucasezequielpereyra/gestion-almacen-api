import { ObjectId } from 'mongoose'

export interface IOrganization {
  _id: ObjectId
  name: string
  employees: ObjectId[]
}
