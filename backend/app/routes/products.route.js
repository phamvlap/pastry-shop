import express from 'express';
import ProductController from './../controllers/product.controller.js';
import { authorizeStaff } from './../middlewares/index.js';

const router = express.Router();

router.get('/count', ProductController.getCount);
router.get('/:id', ProductController.getById);
router.get('/', ProductController.index);
router.post('/', authorizeStaff, ProductController.create);
router.patch('/:id', authorizeStaff, ProductController.update);
router.delete('/:id', authorizeStaff, ProductController.delete);

export default router;
