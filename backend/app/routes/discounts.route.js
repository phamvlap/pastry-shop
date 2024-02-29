import express from 'express';
import DiscountController from './../controllers/discount.controller.js';

const router = express.Router();

router.get('/', DiscountController.index);
router.get('/:id', DiscountController.get);
router.post('/', DiscountController.store);
router.patch('/:id', DiscountController.update);
router.delete('/:id', DiscountController.delete);

export default router;