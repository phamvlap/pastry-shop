import express from 'express';
import RatingController from './../controllers/rating.controller.js';
import { authorizeCustomer } from './../middlewares/index.js';

const router = express.Router();

router.get('/', RatingController.index);
router.get('/:id', RatingController.getForProduct);
router.post('/', authorizeCustomer, RatingController.add);

export default router;
