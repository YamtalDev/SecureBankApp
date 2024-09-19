import { Request, Response } from 'express';
import User from '../models/User';
import Transaction from '../models/Transaction';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import mongoose from 'mongoose';

export const makeTransaction = async (req: AuthenticatedRequest, res: Response) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { email: receiverEmail, amount } = req.body;
    const senderEmail = req.user.email;

    // Validate amount and receiverEmail

    // Find sender and receiver
    const sender = await User.findOne({ email: senderEmail }).session(session);
    const receiver = await User.findOne({ email: receiverEmail }).session(session);

    if (!receiver) return res.status(400).json({ message: 'Receiver not found.' });

    if ((sender?.balance || 0) < amount)
      return res.status(400).json({ message: 'Insufficient balance.' });

    // Update balances
    sender!.balance -= amount;
    receiver!.balance += amount;

    await sender!.save({ session });
    await receiver!.save({ session });

    // Record transaction
    const transaction = new Transaction({
      sender: sender!._id,
      receiver: receiver!._id,
      amount,
    });

    await transaction.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({ message: 'Transaction successful.' });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ message: 'Transaction failed.', error });
  }
};
