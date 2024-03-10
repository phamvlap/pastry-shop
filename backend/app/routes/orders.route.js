import express from 'express';
import OrderController from './../controllers/order.controller.js';
import authorizeStaff from './../middlewares/authorizeStaff.js';
import authorizeCustomer from './../middlewares/authorizeCustomer.js';
import authorizeStaffOrCustomer from './../middlewares/authorizeStaffOrCustomer.js';

const router = express.Router();

router.get('/', authorizeStaff, OrderController.index);
router.get('/:id/detail', authorizeStaffOrCustomer, OrderController.get);
router.get('/user', authorizeCustomer, OrderController.getUserOrders);
router.post('/', authorizeCustomer, OrderController.create);
router.patch('/:id', authorizeStaffOrCustomer, OrderController.update);
router.delete('/:id', authorizeStaffOrCustomer, OrderController.delete);

export default router;