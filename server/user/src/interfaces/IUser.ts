import { Document, ObjectId } from 'mongoose';

export interface IUser extends Document {
  _id: ObjectId;
  email: string;
  password: string;
  phoneNumber: string;
  isVerified?: boolean;
  balance: number;
  createdAt: Date;
  updatedAt: Date;
}
