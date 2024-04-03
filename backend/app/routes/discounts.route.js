import express from 'express';
import DiscountController from './../controllers/discount.controller.js';
import { authorizeStaff } from './../middlewares/index.js';

const router = express.Router();

router.get('/', DiscountController.index);
router.get('/:id', DiscountController.getById);
router.post('/', authorizeStaff, DiscountController.create);
router.patch('/:id', authorizeStaff, DiscountController.update);

export default router;