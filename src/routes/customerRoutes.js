import express from 'express';
import { create, getProfile, updateProfile, createMpin, verifyMpin, getAll, forgotMpin } from '../controllers/customerCtrl.js';
import customerCtrl, { sendOTP, verifyOTP } from '../controllers/customerCtrl.js';
import authenticate from '../auth/authenticate.js';
import { authorize } from '../auth/authorize.js';
import Actions from '../auth/actions.js';
import Resources from '../auth/resources.js';

const router = express.Router();

router.post('/otp/send', sendOTP);
router.post('/otp/verify', verifyOTP);
router.post('/mpin/verify', verifyMpin); // login
router.put('/mpin', authenticate, createMpin);
router.post('/mpin/forgot', authenticate, forgotMpin);

router.post('/', authenticate, create);
router.get('/profile', authenticate, getProfile);
router.put('/profile', authenticate, updateProfile);

router.get('/summary', authenticate, authorize(Actions.READ, Resources.PROFILE, false), customerCtrl.getTotalCustomers);



router.get('/', authenticate, authorize(Actions.READ, Resources.PROFILE, false), getAll);

export default router;