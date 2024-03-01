import express from 'express';
import CategoryController from './../controllers/category.controller.js';

const router = express.Router();

router.get('/', CategoryController.index);
router.post('/', CategoryController.store);
router.patch('/:id', CategoryController.update);
router.delete('/:id', CategoryController.delete);

export default router;