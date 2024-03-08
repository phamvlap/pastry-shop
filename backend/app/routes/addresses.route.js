import express from 'express';
import AddressController from './../controllers/address.controller.js';

const router = express.Router();

router.get('/', AddressController.get);
router.post('/', AddressController.create);
router.patch('/:addressId', AddressController.update);
router.delete('/:addressId', AddressController.delete);

export default router;