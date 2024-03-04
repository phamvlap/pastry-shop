import express from 'express';
import SupplierController from './../controllers/supplier.controller.js';
import authorizeStaff from './../middlewares/authorizeStaff.js';

const router = express.Router();

router.get('/', SupplierController.index);
router.get('/:id', SupplierController.get);
router.post('/', authorizeStaff, SupplierController.store);
router.patch('/:id', authorizeStaff, SupplierController.update);
router.delete('/:id', authorizeStaff, SupplierController.delete);

export default router;