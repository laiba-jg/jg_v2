import express from 'express';
import { create, getProfile, updateProfile, updateKyc } from '../controllers/customerCtrl.js';
import { sendOTP, verifyOTP } from '../controllers/customerCtrl.js';
import { authorizeCreateProfile } from '../auth/authorize.js';

const router = express.Router();

router.post('/', authorizeCreateProfile, create);
router.get('/:id', getProfile);
router.put('/:id', updateProfile);
router.put('/kyc/:id', updateKyc);
router.post('/otp/send', sendOTP);
router.post('/otp/verify', verifyOTP);

export default router;