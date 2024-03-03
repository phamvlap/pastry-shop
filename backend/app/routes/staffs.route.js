import express from 'express';
import StaffController from './../controllers/staff.controller.js';

const router = express.Router();

router.get('/', StaffController.index);
router.get('/:id', StaffController.getById);
router.post('/login', StaffController.login);
router.post('/', StaffController.create);
router.patch('/:id', StaffController.update);
router.patch('/:id/password', StaffController.updatePassword);
router.delete('/:id', StaffController.delete);

export default router;