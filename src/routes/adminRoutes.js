import express from 'express';
import authenticate from '../auth/authenticate.js';
import adminCtrl from '../controllers/adminCtrl.js';
import { authorize } from '../auth/authorize.js';
import Actions from '../auth/actions.js';
import Resources from '../auth/resources.js';

const router = express.Router();

router.post('/tokens',
    authenticate,
    authorize(Actions.CREATE, Resources.AUTH_TOKENS, false),
    adminCtrl.generateToken);

export default router;