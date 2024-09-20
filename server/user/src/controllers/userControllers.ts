import { Request, Response, NextFunction } from 'express';

import logger from '../config/logger';
import {
  createUserService,
  getUserByIdService,
  getAllUsersService,
  updateUserService,
  deleteUserService,
  patchUserService,
} from '../services/userServices';
import { toUserDTO } from '../dto/UserResponseDTO';

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  logger.info('Create User Request Received', { body: req.body });

  try {
    const { email, password, phoneNumber } = req.body;
    const user = await createUserService({ email, password, phoneNumber });
    res.status(201).json({
      message: 'User created successfully.',
      user: toUserDTO(user),
    });
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  logger.info(`Get User by ID Request Received: ${req.params.id}`);

  try {
    const user = await getUserByIdService(req.params.id);
    res.json({ user: toUserDTO(user!) });
  } catch (error) {
    next(error);
  }
};

export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  logger.info('Get All Users Request Received');

  try {
    const users = await getAllUsersService();
    res.json({ users: users.map(toUserDTO) });
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  logger.info(`Update User Request Received: ${req.params.id}`, { body: req.body });

  try {
    const updatedUser = await updateUserService(req.params.id, req.body);
    res.json({
      message: 'User updated successfully.',
      user: toUserDTO(updatedUser!)
    });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  logger.info(`Delete User Request Received: ${req.params.id}`);

  try {
    const deletedUser = await deleteUserService(req.params.id);
    res.json({ message: 'User deleted successfully.' });
  } catch (error) {
    next(error);
  }
};

export const patchUser = async (req: Request, res: Response, next: NextFunction) => {
  logger.info(`Patch User Request Received: ${req.params.id}`, { body: req.body });

  try {
    const patchedUser = await patchUserService(req.params.id, req.body);
    res.json({
      message: 'User patched successfully.',
      user: toUserDTO(patchedUser!)
    });
  } catch (error) {
    next(error);
  }
};
