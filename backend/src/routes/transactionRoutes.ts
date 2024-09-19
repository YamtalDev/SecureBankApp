import { Router } from 'express';
import { makeTransaction } from '../controllers/transactionController';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();

router.post('/send', authenticate, makeTransaction);

export default router;
