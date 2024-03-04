import express from 'express';
import CategoryController from './../controllers/category.controller.js';
import authorizeStaff from './../middlewares/authorizeStaff.js';

const router = express.Router();

router.get('/', CategoryController.index);
router.post('/', authorizeStaff, CategoryController.store);
router.patch('/:id', authorizeStaff, CategoryController.update);
router.delete('/:id', authorizeStaff, CategoryController.delete);

export default router;