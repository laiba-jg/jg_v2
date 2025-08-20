import express from 'express';
import authenticate from '../auth/authenticate.js';
import webhookCtrl from '../controllers/webhookCtrl.js';
import { authorizeKYC, authorizePaymentGateway } from '../auth/authorize.js';
import Actions from '../auth/actions.js';
import Resources from '../auth/resources.js';

const router = express.Router();

router.put('/kyc',
    authenticate,
    authorizeKYC(Actions.UPDATE, Resources.KYC, false),
    webhookCtrl.kycWebhook);

router.put('/payment',
    authenticate,
    authorizePaymentGateway(Actions.UPDATE, Resources.PAYMENT, false),
    webhookCtrl.paymentGatewayWebhook);

export default router;