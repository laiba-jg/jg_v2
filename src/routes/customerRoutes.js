import express from 'express';
import { create, getProfile, updateProfile, updateKyc, createMpin, verifyMpin } from '../controllers/customerCtrl.js';
import { sendOTP, verifyOTP } from '../controllers/customerCtrl.js';
import { authorizeCreateProfile } from '../auth/authorize.js';
import authenticate from '../auth/authenticate.js';

const router = express.Router();

router.post('/otp/send', sendOTP);
router.post('/otp/verify', verifyOTP);

router.post('/', authenticate, create);
router.get('/:id', authenticate, getProfile);
router.put('/:id', authenticate, updateProfile);



router.put('/mpin', authenticate, createMpin);
router.post('/mpin/verify', authenticate, verifyMpin);

router.put('/kyc/:id', authenticate, updateKyc);

export default router;