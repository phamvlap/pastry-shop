import { StatusCodes } from 'http-status-codes';
import { OrderModel } from './../models/index.js';
import { BadRequestError } from './../errors/index.js';

class OrderController {
    async index(req, res, next) {
        try {
            const orderModel = new OrderModel();
            const filter = {
                status_id: req.query.status_id,
                start_date: req.query.start_date,
                end_date: req.query.end_date,
                order_total: req.query.order_total,
                limit: req.query.limit,
                offset: req.query.offset,
            };
            const orders = await orderModel.getAll(filter);
            res.status(StatusCodes.OK).json({
                status: 'success',
                data: orders,
            });
        } catch (error) {
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
        } catch (error) {
            next(new BadRequestError(error.message));
        }
    }
    async getUserOrders(req, res, next) {
        try {
            const orderModel = new OrderModel();
            const orders = await orderModel.getUserOrders(req.customer.customer_id, req.params.statusId);
            res.status(StatusCodes.OK).json({
                status: 'success',
                data: orders,
            });
        } catch (error) {
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
        } catch (error) {
            next(new BadRequestError(error.message));
        }
    }
    async update(req, res, next) {
        try {
            const orderModel = new OrderModel();
            let implementer = {};
            if (req.activePerson) {
                implementer = { ...req.activePerson };
            }
            await orderModel.update(req.params.id, req.body.status_id, implementer);
            res.status(StatusCodes.OK).json({
                status: 'success',
                message: 'Order updated successfully',
            });
        } catch (error) {
            next(new BadRequestError(error.message));
        }
    }
    async delete(req, res, next) {
        try {
            const orderModel = new OrderModel();
            let implementer = {};
            if (req.activePerson) {
                implementer = { ...req.activePerson };
            }
            await orderModel.destroy(req.params.id, implementer);
            res.status(StatusCodes.OK).json({
                status: 'success',
                message: 'Order destroyed successfully',
            });
        } catch (error) {
            next(new BadRequestError(error.message));
        }
    }
}

export default new OrderController();
