import { StatusCodes } from 'http-status-codes';
import { PaymentMethodModel } from './../models/index.js';
import { BadRequestError } from './../errors/index.js';

class PaymentController {
    async index(req, res, next) {
        try {
            const paymentModel = new PaymentMethodModel();
            const paymentMethods = await paymentModel.getAll();
            return res.status(StatusCodes.OK).json({
                status: 'success',
                data: paymentMethods,
            });
        } catch (error) {
            next(new BadRequestError(error.message));
        }
    }
    async getById(req, res, next) {
        try {
            const paymentModel = new PaymentMethodModel();
            const paymentMethod = await paymentModel.get(req.params.id);
            return res.status(StatusCodes.OK).json({
                status: 'success',
                data: paymentMethod,
            });
        } catch (error) {
            next(new BadRequestError(error.message));
        }
    }
}

export default new PaymentController();
