import { StatusCodes } from 'http-status-codes';
import OrderModel from './../models/order.model.js';
import { BadRequestError } from './../errors/index.js';

class OrderController {
    async index(req, res, next) {
        try {
            const orderModel = new OrderModel();
            const orders = await orderModel.getAll();
            res.status(StatusCodes.OK).json({
                status: 'success',
                data: orders,
            });
        }
        catch(error) {
            next(new BadRequestError(error.message));
        }
    }
    async get(req, res, next) {
        try {
            const orderModel = new OrderModel();
            const order = await orderModel.get(req.params.id);
            res.status(StatusCodes.OK).json({
                status: 'success',
                data: order,
            });
        }
        catch(error) {
            next(new BadRequestError(error.message));
        }
    }
    async getUserOrders(req, res, next) {
        try {
            const orderModel = new OrderModel();
            const orders = await orderModel.getUserOrders(req.customer.customer_id);
            res.status(StatusCodes.OK).json({
                status: 'success',
                data: orders,
            });
        }
        catch(error) {
            next(new BadRequestError(error.message));
        }
    }
    async create(req, res, next) {
        try {
            const orderModel = new OrderModel();
            await orderModel.add(req.customer.customer_id, req.body);
            res.status(StatusCodes.OK).json({
                status: 'success',
                message: 'Order created successfully',
            });
        }
        catch(error) {
            next(new BadRequestError(error.message));
        }
    }
    async update(req, res, next) {
        try {
            const orderModel = new OrderModel();
            let implementer = {};
            if(req.activePerson) {
                implementer = { ...req.activePerson };
            }
            await orderModel.update(req.params.id, req.body.statusId, implementer);
            res.status(StatusCodes.OK).json({
                status: 'success',
                message: 'Order updated successfully',
            });
        }
        catch(error) {
            next(new BadRequestError(error.message));
        }
    }
    async delete(req, res, next) {
        try {
            const orderModel = new OrderModel();
            let implementer = {};
            if(req.activePerson) {
                implementer = { ...req.activePerson };
            }
            await orderModel.destroy(req.params.id, implementer);
            res.status(StatusCodes.OK).json({
                status: 'success',
                message: 'Order destroyed successfully',
            });
        }
        catch(error) {
            next(new BadRequestError(error.message));
        }
    }
}

export default new OrderController();