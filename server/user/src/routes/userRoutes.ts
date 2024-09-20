import { Router } from 'express';
import {
  createUser,
  getUserById,
  getAllUsers,
  updateUser,
  deleteUser,
  patchUser,
} from '../controllers/userControllers';

import { validateUser, validateUserId } from '../middlewares/validationMiddleware';

const router = Router();

router.post('/', validateUser, createUser);
router.get('/', getAllUsers);
router.get('/:id', validateUserId, getUserById);
router.put('/:id', validateUserId, validateUser, updateUser);
router.patch('/:id', validateUserId, validateUser, patchUser);
router.delete('/:id', validateUserId, deleteUser);

export default router;