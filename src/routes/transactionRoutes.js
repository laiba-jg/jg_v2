import express from 'express';
import { buy, getAll, getAllQuantitySummary, getAllSummary, redeem, sell, summary } from '../controllers/transactionCtrl.js';
import authenticate from '../auth/authenticate.js';
import { authorize } from '../auth/authorize.js';
import Actions from '../auth/actions.js';
import Resources from '../auth/resources.js';

const router = express.Router();

router.use(authenticate);


router.post('/buy', authorize(Actions.CREATE, Resources.TRANSACTION, false), buy);
router.post('/sell', authorize(Actions.CREATE, Resources.TRANSACTION, false), sell);
router.get('/redeem', authorize(Actions.CREATE, Resources.TRANSACTION, false), redeem);
router.get('/summary/customer/:customerId', authorize(Actions.READ, Resources.TRANSACTIONS_SUMMARY, true), summary);

router.get('/', authorize(Actions.READ, Resources.TRANSACTION, false), getAll);
router.get('/summary', authorize(Actions.READ, Resources.TRANSACTION, false), getAllSummary);
router.get('/summary/quantity', authorize(Actions.READ, Resources.TRANSACTION, false), getAllQuantitySummary);

export default router;