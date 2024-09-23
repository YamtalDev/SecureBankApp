import { Document, Types } from 'mongoose';

export interface IUser extends Document {
  _id: Types.ObjectId;
  email: string;
  password: string;
  phoneNumber: string;
  isVerified?: boolean;
  balance: number;
  createdAt: Date;
  updatedAt: Date;
}
