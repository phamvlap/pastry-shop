import express from 'express';
import PaymentController from './../controllers/payment.controller.js';

const router = express.Router();

router.get('/:id', PaymentController.getById);
router.get('/', PaymentController.index);

export default router;
