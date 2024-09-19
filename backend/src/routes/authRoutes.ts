import { Router } from 'express';
import { signUp, signIn, verifyPhone } from '../controllers/authController';

const router = Router();

router.post('/signup', signUp);
router.post('/signin', signIn);
router.post('/verify', verifyPhone);

export default router;
