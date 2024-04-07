import { StatusCodes } from 'http-status-codes';
import { BadRequestError } from './../errors/index.js';
import { AddressModel } from './../models/index.js';

class AddressController {
    async get(req, res, next) {
        try {
            const addressModel = new AddressModel();
            const addresses = await addressModel.get(req.customer.customer_id);
            return res.status(StatusCodes.OK).json({
                status: 'success',
                data: addresses,
            });
        }
        catch(error) {
            next(new BadRequestError(error.message));
        }
    }
    async create(req, res, next) {
        try {
            const addressModel = new AddressModel();
            const data = {
                ...req.body,
                customer_id: req.customer.customer_id,
            }
            await addressModel.store(data);
            return res.status(StatusCodes.OK).json({
                status: 'success',
                message: 'Address is added successfully.',
            });
        }
        catch(error) {
            next(new BadRequestError(error.message));
        }
    }
    async update(req, res, next) {
        try {
            const addressModel = new AddressModel();
            await addressModel.update(req.params.addressId, req.body);
            return res.status(StatusCodes.OK).json({
                status: 'success',
                message: 'Address is updated successfully.',
            });
        }
        catch(error) {
            next(new BadRequestError(error.message));
        }
    }
    async setDefault(req, res, next) {
        try {
            const addressModel = new AddressModel();
            await addressModel.setDefault(req.params.addressId);
            return res.status(StatusCodes.OK).json({
                status: 'success',
                message: 'Address is updated successfully.',
            });
        }
        catch(error) {
            next(new BadRequestError(error.message));
        }
    }
    async delete(req, res, next) {
        try {
            const addressModel = new AddressModel();
            await addressModel.delete(req.params.addressId);
            return res.status(StatusCodes.OK).json({
                status: 'success',
                message: 'Address is deleted successfully.',
            });
        }
        catch(error) {
            next(new BadRequestError(error.message));
        }
    }
}

export default new AddressController();