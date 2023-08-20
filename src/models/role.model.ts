import { Schema, model } from 'mongoose'
import { IRole } from '../interfaces/role.interface'

const roleSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  }
})

const RoleModel = model<IRole>('Role', roleSchema)

export default RoleModel
