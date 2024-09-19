import { Router } from 'express';
import {
  createUser,
  getUserById,
  getAllUsers,
  updateUser,
  deleteUser,
  patchUser,
} from '../controllers/userControllers';

import { validateUser } from '../middlewares/validationMiddleware';

const router = Router();

router.post('/', validateUser, createUser);
router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.put('/:id', updateUser);
router.patch('/:id', patchUser);
router.delete('/:id', deleteUser);

export default router;