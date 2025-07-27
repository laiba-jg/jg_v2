import express from 'express';
import { buy, redeem, sell, summary } from '../controllers/transactionCtrl.js';

const router = express.Router();

router.post('/buy', buy);
router.post('/sell', sell);
router.get('/redeem', redeem);
router.get('/summary/customer/:customerId', summary);

export default router;