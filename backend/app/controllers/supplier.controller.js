import { StatusCodes } from 'http-status-codes';
import { SupplierModel } from './../models/index.js';
import { BadRequestError } from './../errors/index.js';

class SupplierController {
    async index(req, res, next) {
        try {
            const supplierModel = new SupplierModel();
            const suppliers = await supplierModel.getAll(
                req.query.supplier_name,
                req.query.supplier_address,
                req.query.limit,
                req.query.offset
            );
            return res.status(StatusCodes.OK).json({
                status: 'success',
                data: suppliers,
            });
        }
        catch(error) {
            next(new BadRequestError(error.message));
        }
    }
    async getById(req, res, next) {
        try {
            const supplierModel = new SupplierModel();
            const supplier = await supplierModel.getById(req.params.id);
            return res.status(StatusCodes.OK).json({
                status: 'success',
                data: supplier,
            });
        }
        catch(error) {
            next(new BadRequestError(error.message));
        }
    }
    async create(req, res, next) {
        try {
            const supplierModel = new SupplierModel();
            await supplierModel.store(req.body);
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