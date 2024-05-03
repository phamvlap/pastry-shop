import express from 'express';
import AccountController from './../controllers/account.controller.js';
import { authorizeStaff, authorizeAdmin, authorizeStaffOrCustomer } from './../middlewares/index.js';

const router = express.Router();

router.get('/', authorizeStaff, AccountController.index);
router.post('/login', AccountController.login);
router.post('/:id/password', authorizeStaffOrCustomer, AccountController.changePassword);

router.post('/forgot-password', AccountController.forgotPassword);
router.post('/forgot-password/send', AccountController.sendCode);
router.post('/forgot-password/verify', AccountController.verifyCode);
router.post('/forgot-password/reset', AccountController.resetPassword);

export default router;
