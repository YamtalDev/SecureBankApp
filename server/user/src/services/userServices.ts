import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import createError from 'http-errors';

import User from '../models/User';
import { IUser } from '../interfaces/IUser';

// Create a new user
export const createUserService = async (userData: Partial<IUser>): Promise<IUser> => {
  const { email, password, phoneNumber } = userData;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw createError(409, 'Email already in use.');
  }

  const hashedPassword = await bcrypt.hash(password!, 12);

  const user = new User({
    email,
    password: hashedPassword,
    phoneNumber,
    isVerified: false,
    balance: 0,
  });

  return await user.save();
};

export const getUserByIdService = async (userId: string): Promise<IUser | null> => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw createError(400, 'Invalid user ID.');
  }

  const user = await User.findById(userId);
  if (!user) {
    throw createError(404, 'User not found.');
  }

  return user;
};

export const getAllUsersService = async (): Promise<IUser[]> => {
  try {
    return await User.find();
  } catch (error) {
    throw createError(500, 'Failed to retrieve users.');
  }
};

export const updateUserService = async (userId: string, updateData: Partial<IUser>): Promise<IUser | null> => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw createError(400, 'Invalid user ID.');
  }

  if (updateData.password) {
    updateData.password = await bcrypt.hash(updateData.password, 12);
  }

  const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true });
  if (!updatedUser) {
    throw createError(404, 'User not found.');
  }

  return updatedUser;
};

export const deleteUserService = async (userId: string): Promise<IUser | null> => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw createError(400, 'Invalid user ID.');
  }

  const deletedUser = await User.findByIdAndDelete(userId);
  if (!deletedUser) {
    throw createError(404, 'User not found.');
  }

  return deletedUser;
};

export const patchUserService = async (userId: string, patchData: Partial<IUser>): Promise<IUser | null> => {
  return await updateUserService(userId, patchData);
};
