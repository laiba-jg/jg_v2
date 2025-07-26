import express from 'express';
import { buy, sell, summary } from '../controllers/transactionCtrl.js';

const router = express.Router();

router.post('/buy', buy);
router.post('/sell', sell);
router.get('/summary/customer/:customerId', summary);

export default router;