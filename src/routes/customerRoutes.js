import express from 'express';
import { create, getProfile, updateProfile, updateKyc } from '../controllers/CustomerCtrl.js';

const router = express.Router();

router.post('/', create);
router.get('/:id', getProfile);
router.put('/:id', updateProfile);
router.put('/kyc/:id', updateKyc);

export default router;