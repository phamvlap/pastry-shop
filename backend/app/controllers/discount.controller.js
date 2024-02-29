import { StatusCodes } from 'http-status-codes';
import DiscountModel from './../models/discount.model.js';
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
        }
        catch(error) {
            throw new BadRequestError('Error when fetching discounts.');
        }
    }
    async get(req, res, next) {
        try {
            const discountModel = new DiscountModel();
            const discount = await discountModel.get(req.params.id);
            return res.status(StatusCodes.OK).json({
                status: 'success',
                data: discount,
            });
        }
        catch(error) {
            throw new BadRequestError('Error when fetching discount.');
        }
    }
    async store(req, res, next) {
        try {
            const discountModel = new DiscountModel();
            await discountModel.create(req.body);
            return res.status(StatusCodes.CREATED).json({
                status: 'success',
                message: 'Discount created successfully.',
            });
        }
        catch(error) {
            throw new BadRequestError('Error when creating  discount.');
        }
    }
    async update(req, res) {
        try {
            const discountModel = new DiscountModel();
            await discountModel.update(req.params.id, req.body);
            return res.status(StatusCodes.OK).json({
                status: 'success',
                message: 'Discount updated successfully.',
            });
        }
        catch(error) {
            throw new BadRequestError('Error when updating discount.');
        }
    }

    async delete(req, res) {
        try {
            const discountModel = new DiscountModel();
            await discountModel.delete(req.params.id);
            return res.status(StatusCodes.OK).json({
                status: 'success',
                message: 'Discount deleted successfully.',
            });
        }
        catch(error) {
            throw new BadRequestError('Error when deleting discount.');
        }
    }
}

export default new DiscountController();