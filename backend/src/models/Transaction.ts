import { Schema, model, Document } from 'mongoose';

export interface ITransaction extends Document {
  sender: string;
  receiver: string;
  amount: number;
  createdAt: Date;
}

const transactionSchema = new Schema<ITransaction>(
  {
    sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    receiver: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
  },
  { timestamps: true }
);

export default model<ITransaction>('Transaction', transactionSchema);
