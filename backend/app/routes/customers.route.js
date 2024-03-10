import express from 'express';
import CustomerController from './../controllers/customer.controller.js';
import CartController from './../controllers/cart.controller.js';
import AddressController from './../controllers/address.controller.js';
import { authorizeStaff, authorizeCustomer } from './../middlewares/index.js';

const router = express.Router();

router.get('/', authorizeStaff, CustomerController.index);
router.get('/profile', authorizeCustomer, CustomerController.get);
router.post('/register', CustomerController.register);
router.post('/login', CustomerController.login);
router.patch('/', authorizeCustomer, CustomerController.update);
router.patch('/password', authorizeCustomer, CustomerController.updatePassword);
router.delete('/', authorizeCustomer, CustomerController.delete);

// cart
router.get('/cart', authorizeCustomer, CartController.get);
router.post('/cart', authorizeCustomer, CartController.add);
router.patch('/cart/:itemId', authorizeCustomer, CartController.update);
router.delete('/cart/:itemId', authorizeCustomer, CartController.delete);

// address
router.get('/addresses/', authorizeCustomer, AddressController.get);
router.post('/addresses/', authorizeCustomer, AddressController.create);
router.patch('/addresses/:addressId', authorizeCustomer, AddressController.update);
router.delete('/addresses/:addressId', authorizeCustomer, AddressController.delete);

export default router;