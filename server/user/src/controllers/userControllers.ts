import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';

import {
  createUserService,
  getUserByIdService,
  getAllUsersService,
  updateUserService,
  deleteUserService,
  patchUserService,
} from '../services/userServices';
import { toUserDTO } from '../dto/UserDTO';
import { IUser } from '../interfaces/IUser';
import User from '../models/User';


const handleError = (res: Response, error: any, statusCode: number = 500) => {
  console.error(error);
  res.status(statusCode).json({ message: error.message || 'Internal server error.' });
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map((error) => error.msg);
      return res.status(400).json({ errors: errorMessages });
    }

    const { email, password, phoneNumber } = req.body;

    const existingUser = await getUserByEmailService(email);
    if (existingUser) {
      return res.status(409).json({ message: 'Email already in use.' });
    }

    const user = await createUserService({ email, password, phoneNumber });

    res.status(201).json({
      message: 'User created successfully.',
      user: toUserDTO(user),
    });
  } catch (error) {
    handleError(res, error);
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const user = await getUserByIdService(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    res.json({ user: toUserDTO(user) });
  } catch (error) {
    handleError(res, error);
  }
};

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await getAllUsersService();
    res.json({ users: users.map(toUserDTO) });
  } catch (error) {
    handleError(res, error);
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const updatedUser = await updateUserService(req.params.id, req.body);
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found.' });
    }
    res.json({ message: 'User updated successfully.', user: toUserDTO(updatedUser) });
  } catch (error) {
    handleError(res, error);
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const deletedUser = await deleteUserService(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found.' });
    }
    res.json({ message: 'User deleted successfully.' });
  } catch (error) {
    handleError(res, error);
  }
};

export const patchUser = async (req: Request, res: Response) => {
  try {
    const patchedUser = await patchUserService(req.params.id, req.body);
    if (!patchedUser) {
      return res.status(404).json({ message: 'User not found.' });
    }
    res.json({ message: 'User patched successfully.', user: toUserDTO(patchedUser) });
  } catch (error) {
    handleError(res, error);
  }
};

const getUserByEmailService = async (email: string): Promise<IUser | null> => {
  return await User.findOne({ email });
};