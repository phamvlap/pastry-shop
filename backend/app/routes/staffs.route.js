import express from 'express';
import StaffController from './../controllers/staff.controller.js';
import authorizeStaff from './../middlewares/authorizeStaff.js';
import authorizeAdmin from './../middlewares/authorizeAdmin.js';

const router = express.Router();

router.get('/', authorizeStaff, authorizeAdmin, StaffController.index);
router.get('/:id', StaffController.getById);
router.post('/login', StaffController.login);
router.post('/', authorizeStaff, authorizeAdmin, StaffController.create);
router.patch('/:id', authorizeStaff, StaffController.update);
router.patch('/:id/password', authorizeStaff, StaffController.updatePassword);
router.delete('/:id', authorizeStaff, authorizeAdmin, StaffController.delete);

export default router;