import express from 'express';
import { create, getProfile, updateProfile, updateKyc, createMpin, verifyMpin, getAll } from '../controllers/customerCtrl.js';
import customerCtrl, { sendOTP, verifyOTP } from '../controllers/customerCtrl.js';
import authenticate from '../auth/authenticate.js';

const router = express.Router();

router.post('/otp/send', sendOTP);
router.post('/otp/verify', verifyOTP);

router.post('/', authenticate, create);
router.get('/profile', authenticate, getProfile);
router.put('/profile', authenticate, updateProfile);

router.get('/summary', authenticate, customerCtrl.getTotalCustomers);

router.put('/mpin', authenticate, createMpin);
router.post('/mpin/verify', authenticate, verifyMpin);

router.put('/kyc/:id', authenticate, updateKyc);

router.get('/', authenticate, getAll);

export default router;