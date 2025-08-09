import express from 'express';
import userCtrl from '../controllers/userCtrl.js';
import authenticate from '../auth/authenticate.js';

const router = express.Router();

router.get('/', userCtrl.getAllUsers);
router.get('/:id', userCtrl.getUserById);

router.post('/', userCtrl.createUser);
router.post('/login', userCtrl.loginUser);

router.post('/:id', userCtrl.updateUser);
router.patch('/:id', userCtrl.deactivateUser);

export default router;