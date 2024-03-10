import express from 'express';
import OrderController from './../controllers/order.controller.js';
import { authorizeStaff, authorizeCustomer, authorizeStaffOrCustomer } from './../middlewares/index.js';

const router = express.Router();

router.get('/', authorizeStaff, OrderController.index);
router.get('/:id/detail', authorizeStaffOrCustomer, OrderController.get);
router.get('/user', authorizeCustomer, OrderController.getUserOrders);
router.post('/', authorizeCustomer, OrderController.create);
router.patch('/:id', authorizeStaffOrCustomer, OrderController.update);
router.delete('/:id', authorizeStaffOrCustomer, OrderController.delete);

export default router;