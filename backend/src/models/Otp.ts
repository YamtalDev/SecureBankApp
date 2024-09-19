import { Schema, model, Document } from 'mongoose';

export interface IOtp extends Document {
  userId: string;
  otp: string;
  createdAt: Date;
  expiresAt: Date;
}

const otpSchema = new Schema<IOtp>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    otp: { type: String, required: true },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);

export default model<IOtp>('Otp', otpSchema);
