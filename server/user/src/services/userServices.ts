// services/userServices.ts

import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import User from '../models/User';
import { IUser } from '../interfaces/IUser';

export const createUserService = async (userData: Partial<IUser>): Promise<IUser> => {
  const hashedPassword = await bcrypt.hash(userData.password!, 12);

  const user = new User({
    email: userData.email,
    password: hashedPassword,
    phoneNumber: userData.phoneNumber,
    isVerified: false,
    balance: 0,
  });

  return await user.save();
};

export const getUserByIdService = async (userId: string): Promise<IUser | null> => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error('Invalid user ID.');
  }

  return await User.findById(userId);
};

export const getAllUsersService = async (): Promise<IUser[]> => {
  return await User.find();
};

export const updateUserService = async (userId: string, updateData: Partial<IUser>): Promise<IUser | null> => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error('Invalid user ID.');
  }

  if (updateData.password) {
    updateData.password = await bcrypt.hash(updateData.password, 12);
  }

  return await User.findByIdAndUpdate(userId, updateData, { new: true });
};

export const deleteUserService = async (userId: string): Promise<IUser | null> => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error('Invalid user ID.');
  }

  return await User.findByIdAndDelete(userId);
};

export const patchUserService = async (userId: string, patchData: Partial<IUser>): Promise<IUser | null> => {
  return await updateUserService(userId, patchData);
};