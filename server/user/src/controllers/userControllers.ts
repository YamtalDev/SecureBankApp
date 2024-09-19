import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import logger from '../config/logger';
import {
  createUserService,
  getUserByIdService,
  getAllUsersService,
  updateUserService,
  deleteUserService,
  patchUserService,
} from '../services/userServices';
import { toUserDTO } from '../dto/UserDTO';

const handleError = (res: Response, error: any, statusCode: number = 500) => {
  logger.warn(`Error: ${error.message}`, { stack: error.stack });
  res.status(statusCode).json({ message: error.message || 'Internal server error.' });
};

export const createUser = async (req: Request, res: Response) => {
  try {
    logger.info('Create User Request Received', { body: req.body });

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map((error) => error.msg);
      logger.warn('Validation Errors:', { errors: errorMessages });
      return res.status(400).json({ errors: errorMessages });
    }

    const { email, password, phoneNumber } = req.body;

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
    logger.info(`Get User by ID Request Received: ${req.params.id}`);

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
    logger.info('Get All Users Request Received');

    const users = await getAllUsersService();
    res.json({ users: users.map(toUserDTO) });
  } catch (error) {
    handleError(res, error);
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    logger.info(`Update User Request Received: ${req.params.id}`, { body: req.body });

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
    logger.info(`Delete User Request Received: ${req.params.id}`);

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
    logger.info(`Patch User Request Received: ${req.params.id}`, { body: req.body });

    const patchedUser = await patchUserService(req.params.id, req.body);
    if (!patchedUser) {
      return res.status(404).json({ message: 'User not found.' });
    }
    res.json({ message: 'User patched successfully.', user: toUserDTO(patchedUser) });
  } catch (error) {
    handleError(res, error);
  }
};
