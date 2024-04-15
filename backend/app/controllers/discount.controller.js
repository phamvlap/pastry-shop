import { StatusCodes } from 'http-status-codes';
import { DiscountModel } from './../models/index.js';
import { BadRequestError } from './../errors/index.js';

class DiscountController {
    async index(req, res, next) {
        try {
            const discountModel = new DiscountModel();
            const discounts = await discountModel.getAll();
            return res.status(StatusCodes.OK).json({
                status: 'success',
                data: discounts,
            });
        } catch (error) {
            next(new BadRequestError(error.message));
        }
    }
    async getById(req, res, next) {
        try {
            const discountModel = new DiscountModel();
            const discount = await discountModel.getById(req.params.id);
            return res.status(StatusCodes.OK).json({
                status: 'success',
                data: discount,
            });
        } catch (error) {
            next(new BadRequestError(error.message));
        }
    }
    async create(req, res, next) {
        try {
            const discountModel = new DiscountModel();
            await discountModel.store(req.body);
            return res.status(StatusCodes.CREATED).json({
                status: 'success',
                message: 'Discount created successfully.',
            });
        } catch (error) {
            next(new BadRequestError(error.message));
        }
    }
    async update(req, res, next) {
        try {
            const discountModel = new DiscountModel();
            await discountModel.update(req.params.id, req.body);
            return res.status(StatusCodes.OK).json({
                status: 'success',
                message: 'Discount updated successfully.',
            });
        } catch (error) {
            next(new BadRequestError(error.message));
        }
    }

    async delete(req, res, next) {
        try {
            const discountModel = new DiscountModel();
            await discountModel.delete(req.params.id);
            return res.status(StatusCodes.OK).json({
                status: 'success',
                message: 'Discount deleted successfully.',
            });
        } catch (error) {
            next(new BadRequestError(error.message));
        }
    }
}

export default new DiscountController();
