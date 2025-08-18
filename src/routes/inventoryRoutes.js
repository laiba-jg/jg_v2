import express from 'express';
import inventoryCtrl from '../controllers/inventoryCtrl.js';
import authenticate from '../auth/authenticate.js';
import { authorize } from '../auth/authorize.js';
import Actions from '../auth/actions.js';
import Resources from '../auth/resources.js';

const router = express.Router();

router.use(authenticate);

router.get('/', authorize(Actions.READ, Resources.INVENTORY), inventoryCtrl.getAll);
router.put('/:id', authorize(Actions.UPDATE, Resources.INVENTORY), inventoryCtrl.update);

export default router;