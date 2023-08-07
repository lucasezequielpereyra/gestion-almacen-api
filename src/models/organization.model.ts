import { Schema, model } from 'mongoose'
import { IOrganization } from '../interfaces/organization.interface'

const organizationSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  employees: [
    {
      ref: 'User',
      type: Schema.Types.ObjectId
    }
  ]
})

const OrganizationModel = model<IOrganization>(
  'Organization',
  organizationSchema
)

export default OrganizationModel
