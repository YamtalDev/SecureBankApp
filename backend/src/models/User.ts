import { Schema, model, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password: string;
  phoneNumber: string;
  isVerified: boolean;
  balance: number;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    balance: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default model<IUser>('User', userSchema);
