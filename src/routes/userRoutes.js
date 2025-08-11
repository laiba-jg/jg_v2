import express from 'express';
import userCtrl from '../controllers/userCtrl.js';
import authenticate from '../auth/authenticate.js';
import { authorize, authorizeCreateUpdateUser } from '../auth/authorize.js';
import Resources from '../auth/resources.js';
import Actions from '../auth/actions.js';

const router = express.Router();

router.post('/login', userCtrl.loginUser);

router.get('/', authenticate, authorize(Actions.READ, Resources.USER, false), userCtrl.getAllUsers);
router.get('/:id', authenticate, authorize(Actions.READ, Resources.USER, false), userCtrl.getUserById);

router.post('/', authenticate, authorizeCreateUpdateUser, userCtrl.createUser);
router.put('/:id', authenticate, authorizeCreateUpdateUser, userCtrl.updateUser);
router.patch('/:id', authorizeCreateUpdateUser, userCtrl.deactivateUser);

export default router;