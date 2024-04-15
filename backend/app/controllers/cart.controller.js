import { StatusCodes } from 'http-status-codes';
import { BadRequestError } from './../errors/index.js';
import { CartModel } from './../models/index.js';

class CartController {
    async get(req, res, next) {
        try {
            const cartModel = new CartModel();
            const cart = await cartModel.get(req.customer.customer_id, req.query.cart_is_selected);
            return res.status(StatusCodes.OK).json({
                status: 'success',
                data: cart,
            });
        } catch (error) {
            next(new BadRequestError(error.message));
        }
    }
    async add(req, res, next) {
        try {
            const cartModel = new CartModel();
            const data = {
                customer_id: req.customer.customer_id,
                product_id: req.body.product_id,
                cart_quantity: req.body.cart_quantity,
            };
            await cartModel.add(data);
            return res.status(StatusCodes.OK).json({
                status: 'success',
                message: 'Item is added to cart successfully.',
            });
        } catch (error) {
            next(new BadRequestError(error.message));
        }
    }
    async update(req, res, next) {
        try {
            const data = {
                customer_id: req.customer.customer_id,
                product_id: req.params.itemId,
                cart_quantity: req.body.cart_quantity,
                cart_is_selected: req.body.cart_is_selected,
            };
            const cartModel = new CartModel();
            await cartModel.update(data);
            return res.status(StatusCodes.OK).json({
                status: 'success',
                message: 'Item is updated in cart successfully.',
            });
        } catch (error) {
            next(new BadRequestError(error.message));
        }
    }
    async delete(req, res, next) {
        try {
            const cartModel = new CartModel();
            await cartModel.delete(req.customer.customer_id, req.params.itemId);
            return res.status(StatusCodes.OK).json({
                status: 'success',
                message: 'Item in cart is deleted successfully.',
            });
        } catch (error) {
            next(new BadRequestError(error.message));
        }
    }
}

export default new CartController();
