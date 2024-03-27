import express from 'express';
import ProductController from './../controllers/product.controller.js';
import { authorizeStaff } from './../middlewares/index.js';

const router = express.Router();

router.get('/', ProductController.index);
router.get('/count', ProductController.getCount);
router.get('/filter/count', ProductController.getCountByFilter);
router.get('/filter', ProductController.getProductsByFilter);
router.get('/category/:categoryId', ProductController.getCountByCategory);
router.get('/discount/:discountId', ProductController.getCountByDiscount);
router.get('/:id', ProductController.get);
router.post('/', authorizeStaff, ProductController.create);
router.patch('/:id', authorizeStaff, ProductController.update);
router.delete('/:id', authorizeStaff, ProductController.delete);

export default router;