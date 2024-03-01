import { StatusCodes } from 'http-status-codes';
import CategoryModel from './../models/category.model.js';
import { BadRequestError } from './../errors/index.js';

class CategoryController {
    async index(req, res, next) {
        try {
            const categoryModel = new CategoryModel();
            const categories = await categoryModel.getAll();
            return res.status(StatusCodes.OK).json({
                status: 'success',
                data: categories,
            });
        }
        catch(error) {
            next(new BadRequestError(error.message));
        }
    }
    async store(req, res, next) {
        try {
            const categoryModel = new CategoryModel();
            await categoryModel.create(req.body);
            res.status(StatusCodes.CREATED).json({
                status: 'success',
                message: 'Category created successfully.',
            });
        }
        catch(error) {
            next(new BadRequestError(error.message));
        }
    }
    async update(req, res, next) {
        try {
            const categoryModel = new CategoryModel();
            await categoryModel.update(req.params.id, req.body);
            res.status(StatusCodes.OK).json({
                status: 'success',
                message: 'Category updated successfully.',
            });
        }
        catch(error) {
            next(new BadRequestError(error.message));
        }
    }
    async delete(req, res, next) {
        try {
            const categoryModel = new CategoryModel();
            await categoryModel.delete(req.params.id);
            return res.status(StatusCodes.OK).json({
                status: 'success',
                message: 'Category deleted successfully.',
            });
        }
        catch(error) {
            next(new BadRequestError(error.message));
        }
    }
}

export default new CategoryController();