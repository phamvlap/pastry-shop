import express from 'express';
import StaffController from './../controllers/staff.controller.js';
import { authorizeStaff, authorizeAdmin } from './../middlewares/index.js';

const router = express.Router();

router.get('/', authorizeStaff, authorizeAdmin, StaffController.index);
router.get('/:id', StaffController.getById);
router.post('/login', StaffController.login);
router.post('/', authorizeStaff, authorizeAdmin, StaffController.create);
router.patch('/password', authorizeStaff, StaffController.updatePassword);
router.patch('/:id', authorizeStaff, StaffController.update);
router.delete('/:id', authorizeStaff, authorizeAdmin, StaffController.delete);

export default router;