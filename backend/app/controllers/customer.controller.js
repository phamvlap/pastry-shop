import { unlink } from 'fs/promises';
import multer from 'multer';
import { StatusCodes } from 'http-status-codes';
import { BadRequestError } from './../errors/index.js';
import { CustomerModel } from './../models/index.js';
import { uploadAvatar } from './../utils/index.js';

class CustomerController {
    async index(req, res, next) {
        try {
            const customerModel = new CustomerModel();
            const filter = {
                customer_username: req.query.customer_username,
                customer_name: req.query.customer_name,
                status: req.query.status,
            };
            const customers = await customerModel.getAll(filter);
            return res.status(StatusCodes.OK).json({
                status: 'success',
                data: customers,
            });
        } catch (error) {
            next(new BadRequestError(error.message));
        }
    }
    async getProfile(req, res, next) {
        try {
            const customerModel = new CustomerModel();
            const customer = await customerModel.getById(req.customer.customer_id);
            return res.status(StatusCodes.OK).json({
                status: 'success',
                data: customer,
            });
        } catch (error) {
            next(new BadRequestError(error.message));
        }
    }
    async register(req, res, next) {
        try {
            const customerModel = new CustomerModel();
            const customer = await customerModel.register(req.body);
            res.status(StatusCodes.OK).json({
                status: 'success',
                data: customer,
            });
        } catch (error) {
            next(new BadRequestError(error.message));
        }
    }
    async update(req, res, next) {
        uploadAvatar(req, res, async (err) => {
            if (err instanceof multer.MulterError) {
                if (req.file) {
                    try {
                        await unlink(req.file.path);
                    } catch (err) {
                        return next(new BadRequestError(err.message));
                    }
                }
                return next(new BadRequestError(err.message));
            } else if (err) {
                if (req.file) {
                    try {
                        await unlink(req.file.path);
                    } catch (err) {
                        return next(new BadRequestError(err.message));
                    }
                }
                return next(new BadRequestError(err.message));
            }
            if (req.file) {
                req.body['customer_avatar'] = [req.file];
            }
            try {
                const customerModel = new CustomerModel();
                await customerModel.update(req.customer.customer_id, req.body);
                res.status(StatusCodes.OK).json({
                    status: 'success',
                    message: 'Customer updated successfully',
                });
            } catch (error) {
                if (req.file) {
                    try {
                        await unlink(req.file.path);
                    } catch (err) {
                        return next(new BadRequestError(err.message));
                    }
                }
                next(new BadRequestError(error.message));
            }
        });
    }
    async lock(req, res, next) {
        try {
            const customerModel = new CustomerModel();
            await customerModel.lock(req.params.id);
            return res.status(StatusCodes.OK).json({
                status: 'success',
                message: 'Customer deleted successfully.',
            });
        } catch (error) {
            next(new BadRequestError(error.message));
        }
    }
    async unlock(req, res, next) {
        try {
            const customerModel = new CustomerModel();
            await customerModel.unlock(req.params.id);
            return res.status(StatusCodes.OK).json({
                status: 'success',
                message: 'Customer deleted successfully.',
            });
        } catch (error) {
            next(new BadRequestError(error.message));
        }
    }
}

export default new CustomerController();
