import express from 'express';
import DiscountController from './../controllers/discount.controller.js';
import authorizeStaff from './../middlewares/authorizeStaff.js';

const router = express.Router();

router.get('/', DiscountController.index);
router.get('/:id', DiscountController.get);
router.post('/', authorizeStaff, DiscountController.store);
router.patch('/:id', authorizeStaff, DiscountController.update);

export default router;