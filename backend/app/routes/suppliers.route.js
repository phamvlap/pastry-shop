import express from 'express';
import SupplierController from './../controllers/supplier.controller.js';

const router = express.Router();

router.get('/', SupplierController.index);
router.get('/:id', SupplierController.get);
router.post('/', SupplierController.store);
router.patch('/:id', SupplierController.update);
router.delete('/:id', SupplierController.delete);

export default router;