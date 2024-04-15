import { StatusCodes } from 'http-status-codes';
import { RatingModel } from './../models/index.js';
import { BadRequestError } from './../errors/index.js';

class RatingController {
    async index(req, res, next) {
        try {
            const ratingModel = new RatingModel();
            const filter = {
                rating_star_sort: req.query.rating_star_sort,
                limit: req.query.limit,
                offset: req.query.offset,
            };
            const ratings = await ratingModel.getAll(filter);
            return res.status(StatusCodes.OK).json({
                status: 'success',
                data: ratings,
            });
        } catch (error) {
            next(new BadRequestError(error.message));
        }
    }
    async getForProduct(req, res, next) {
        try {
            const ratingModel = new RatingModel();
            const rating = await ratingModel.getAllRatingForProduct(req.params.id);
            return res.status(StatusCodes.OK).json({
                status: 'success',
                data: rating,
            });
        } catch (error) {
            next(new BadRequestError(error.message));
        }
    }
    async add(req, res, next) {
        try {
            const ratingModel = new RatingModel();
            const data = {
                customer_id: req.customer.customer_id,
                product_id: req.body.product_id,
                rating_content: req.body.rating_content,
                rating_star: req.body.rating_star,
            };
            await ratingModel.add(data);
            return res.status(StatusCodes.CREATED).json({
                status: 'success',
                message: 'Rating created successfully.',
            });
        } catch (error) {
            next(new BadRequestError(error.message));
        }
    }
}

export default new RatingController();
