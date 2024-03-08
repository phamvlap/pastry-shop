import express from 'express';
import CustomerController from './../controllers/customer.controller.js';
import authorizeStaff from './../middlewares/authorizeStaff.js';
import authorizeCustomer from './../middlewares/authorizeCustomer.js';

const router = express.Router();

router.get('/', authorizeStaff, CustomerController.index);
router.get('/profile', authorizeCustomer, CustomerController.get);
router.post('/register', CustomerController.register);
router.post('/login', CustomerController.login);
router.patch('/', authorizeCustomer, CustomerController.update);
router.patch('/password', authorizeCustomer, CustomerController.updatePassword);
router.delete('/', authorizeCustomer, CustomerController.delete);

export default router;