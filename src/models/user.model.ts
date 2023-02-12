import { Schema, model } from 'mongoose'
import { IUser } from '../interfaces/user.interface'
import bcrypt from 'bcryptjs'

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true
    },
    password: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    roles: [
      {
        ref: 'Role',
        type: Schema.Types.ObjectId
      }
    ],
    refreshToken: [String]
  },
  {
    timestamps: true,
    versionKey: false
  }
)

userSchema.pre('save', async function (next) {
  this.password = await bcrypt.hash(this.password, 10)
  next()
})

const UserModel = model<IUser>('User', userSchema)

export default UserModel
