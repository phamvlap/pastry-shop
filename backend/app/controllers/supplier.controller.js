import { StatusCodes } from 'http-status-codes';
import SupplierModel from './../models/supplier.model.js';
import { BadRequestError } from './../errors/index.js';

class SupplierController {
    async index(req, res, next) {
        try {
            const supplierModel = new SupplierModel();
            const suppliers = await supplierModel.getAll();
            return res.status(StatusCodes.OK).json({
                status: 'success',
                data: suppliers,
            });
        }
        catch(error) {
            next(new BadRequestError(error.message));
        }
    }
    async get(req, res, next) {
        try {
            const supplierModel = new SupplierModel();
            const supplier = await supplierModel.get(req.params.id);
            return res.status(StatusCodes.OK).json({
                status: 'success',
                data: supplier,
            });
        }
        catch(error) {
            next(new BadRequestError(error.message));
        }
    }
    async store(req, res, next) {
        try {
            const supplierModel = new SupplierModel();
            await supplierModel.create(req.body);
            return res.status(StatusCodes.CREATED).json({
                status: 'success',
                message: 'Supplier created successfully.',
            });
        }
        catch(error) {
            next(new BadRequestError(error.message));
        }
    }
    async update(req, res, next) {
        try {
            const supplierModel = new SupplierModel();
            await supplierModel.update(req.params.id, req.body);
            return res.status(StatusCodes.OK).json({
                status: 'success',
                message: 'Supplier updated successfully.',
            });
        }
        catch(error) {
            next(new BadRequestError(error.message));
        }
    }
    async delete(req, res, next) {
        try {
            const supplierModel = new SupplierModel();
            await supplierModel.delete(req.params.id);
            return res.status(StatusCodes.OK).json({
                status: 'success',
                message: 'Supplier deleted successfully.',
            });
        }
        catch(error) {
            next(new BadRequestError(error.message));
        }
    }
}

export default new SupplierController();