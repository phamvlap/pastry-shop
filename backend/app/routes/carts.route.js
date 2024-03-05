import express from 'express';
import CartController from './../controllers/cart.controller.js';

const router = express.Router();

router.get('/', CartController.get);
router.post('/', CartController.add);
router.patch('/:itemId', CartController.update);
router.delete('/:itemId', CartController.delete);

export default router;