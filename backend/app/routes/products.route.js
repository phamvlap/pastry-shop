import express from 'express';
import ProductController from './../controllers/product.controller.js';

const router = express.Router();

router.get('/', ProductController.index);
router.get('/:id', ProductController.get);
router.post('/', ProductController.save);
router.patch('/:id', ProductController.update);
router.delete('/:id', ProductController.delete);

export default router;