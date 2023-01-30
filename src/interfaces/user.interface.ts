import { ObjectId } from 'mongoose';

export interface IUser {
  _id: ObjectId;
  username: string;
  password: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}
