import express from 'express';
import SupplierController from './../controllers/supplier.controller.js';
import { authorizeStaff } from './../middlewares/index.js';

const router = express.Router();

router.get('/', SupplierController.index);
router.get('/:id', SupplierController.getById);
router.post('/', authorizeStaff, SupplierController.create);
router.patch('/:id', authorizeStaff, SupplierController.update);
router.delete('/:id', authorizeStaff, SupplierController.delete);

export default router;
