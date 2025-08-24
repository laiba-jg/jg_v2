import express from 'express';
import authenticate, { validateMyFatoorahSignature } from '../auth/authenticate.js';
import webhookCtrl from '../controllers/webhookCtrl.js';
import { authorizeKYC, authorizePaymentGateway } from '../auth/authorize.js';
import Actions from '../auth/actions.js';
import Resources from '../auth/resources.js';

const router = express.Router();

router.post('/kyc',
    authenticate,
    authorizeKYC(Actions.UPDATE, Resources.KYC, false),
    webhookCtrl.kycWebhook);

router.post('/myfatoorah',
    validateMyFatoorahSignature,
    webhookCtrl.myFatoorah);

export default router;