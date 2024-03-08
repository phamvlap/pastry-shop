import { unlink } from 'fs/promises';
import multer from 'multer';
import { StatusCodes } from 'http-status-codes';
import { BadRequestError } from './../errors/index.js';
import CustomerModel from './../models/customer.model.js';
import uploadAvatar from './../utils/uploadAvatar.util.js';

class CustomerController {
    async index(req, res, next) {
        try {
            const customerModel = new CustomerModel();
            const customers = await customerModel.getAll();
            return res.status(StatusCodes.OK).json({
                status: 'success',
                data: customers,
            });
        }
        catch(error) {
            next(new BadRequestError(error.message));
        }
    }
    async get(req, res, next) {
        try {
            const customerModel = new CustomerModel();
            const customer = await customerModel.getById(req.customer.customer_id);
            return res.status(StatusCodes.OK).json({
                status: 'success',
                data: customer,
            });
        }
        catch(error) {
            next(new BadRequestError(error.message));
        }
    }
    async register(req, res, next) {
        uploadAvatar(req, res, async err => {
            if(err instanceof multer.MulterError) {
                if(req.file) {
                    try {
                        await unlink(req.file.path);
                    }
                    catch(err) {
                        return next(new BadRequestError(err.message));
                    }
                }
                return next(new BadRequestError(err.message));
            }
            else if(err) {
                if(req.file) {
                    try {
                        await unlink(req.file.path);
                    }
                    catch(err) {
                        return next(new BadRequestError(err.message));
                    }
                }
                return next(new BadRequestError(err.message));
            }
            if(req.file) {
                req.body['customer_avatar'] = [ req.file ];
            }
            try {
                const customerModel = new CustomerModel();
                const customer = await customerModel.register(req.body);
                res.status(StatusCodes.OK).json({
                    status: 'success',
                    data: customer,
                });
            }
            catch(error) {
                if(req.file) {
                    try {
                        await unlink(req.file.path);
                    }
                    catch(err) {
                        return next(new BadRequestError(err.message));
                    }
                }
                next(new BadRequestError(error.message));
            }
        });
    }
    async login(req, res, next) {
        try {
            const payload = {
                customer_username: req.body.username,
                customer_password: req.body.password,
            }
            const customerModel = new CustomerModel();
            const customer = await customerModel.login(payload.customer_username, payload.customer_password);
            return res.status(StatusCodes.OK).json({
                status: 'success',
                data: customer,
            });
        }
        catch(error) {
            next(new BadRequestError(error.message));
        }
    }
    async update(req, res, next) {
        uploadAvatar(req, res, async err => {
            if(err instanceof multer.MulterError) {
                if(req.file) {
                    try {
                        await unlink(req.file.path);
                    }
                    catch(err) {
                        return next(new BadRequestError(err.message));
                    }
                }
                return next(new BadRequestError(err.message));
            }
            else if(err) {
                if(req.file) {
                    try {
                        await unlink(req.file.path);
                    }
                    catch(err) {
                        return next(new BadRequestError(err.message));
                    }
                }
                return next(new BadRequestError(err.message));
            }
            if(req.file) {
                req.body['customer_avatar'] = [ req.file ];
            }
            try {
                const customerModel = new CustomerModel();
                await customerModel.update(req.customer.customer_id, req.body);
                res.status(StatusCodes.OK).json({
                    status: 'success',
                    message: 'Customer updated successfully',
                });
            }
            catch(error) {
                if(req.file) {
                    try {
                        await unlink(req.file.path);
                    }
                    catch(err) {
                        return next(new BadRequestError(err.message));
                    }
                }
                next(new BadRequestError(error.message));
            }
        });
    }
    async updatePassword(req, res, next) {
        try {
            const customerModel = new CustomerModel();
            const data = {
                customer_password: req.body.customer_password,
                customer_new_password: req.body.customer_new_password,
                customer_confirm_password: req.body.customer_confirm_password,
            }
            await customerModel.changePassword(req.customer.customer_id, data);
            return res.status(StatusCodes.OK).json({
                status: 'success',
                message: 'Password changed successfully.',
            });
        }
        catch(error) {
            next(new BadRequestError(error.message));
        }
    }
    async delete(req, res, next) {
        try {
            const customerModel = new CustomerModel();
            await customerModel.delete(req.customer.customer_id);
            return res.status(StatusCodes.OK).json({
                status: 'success',
                message: 'Customer deleted successfully.',
            });
        }
        catch(error) {
            next(new BadRequestError(error.message));
        }
    }
}

export default new CustomerController();