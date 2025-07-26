import express from 'express';
import { buy } from '../controllers/transactionCtrl.js';

const router = express.Router();

router.post('/buy', buy);

export default router;