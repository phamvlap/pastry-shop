import express from 'express';
import VNPAYController from './../controllers/vnpay.controller.js';

const router = express.Router();

router.post('/create', VNPAYController.buildUrl);
router.get('/ipn', VNPAYController.getIpnUrl);
router.get('/return', VNPAYController.returnUrl);

export default router;
