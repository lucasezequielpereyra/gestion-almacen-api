import { ObjectId } from 'mongoose'

export interface IUser {
  _id: ObjectId
  username: string
  password: string
  email: string
  roles: [ObjectId]
  refreshToken: Array<String>
  createdAt: Date
  updatedAt: Date
}
