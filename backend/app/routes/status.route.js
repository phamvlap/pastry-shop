import express from 'express';
import StatusController from './../controllers/status.controller.js';

const router = express.Router();

router.get('/', StatusController.index);

export default router;
