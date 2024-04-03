import express from 'express';
import AccountController from './../controllers/account.controller.js';
import { authorizeStaff, authorizeAdmin, authorizeStaffOrCustomer } from './../middlewares/index.js';

const router = express.Router();

router.post('/login', AccountController.login);
router.post('/:id/password', authorizeStaffOrCustomer, AccountController.changePassword);

export default router;