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
            throw new BadRequestError('Error when fetching categories.');
        }
    }
    async store(req, res, next) {
        try {
            const categoryModel = new CategoryModel();
            await categoryModel.create(req.body);
            return res.status(StatusCodes.CREATED).json({
                status: 'success',
                message: 'Category created successfully.',
            });
        }
        catch(error) {
            throw new BadRequestError('Error when creating  category.');
        }
    }
    async update(req, res) {
        try {
            const categoryModel = new CategoryModel();
            await categoryModel.update(req.params.id, req.body);
            return res.status(StatusCodes.OK).json({
                status: 'success',
                message: 'Category updated successfully.',
            });
        }
        catch(error) {
            throw new BadRequestError('Error when updating category.');
        }
    }

    async delete(req, res) {
        try {
            const categoryModel = new CategoryModel();
            await categoryModel.delete(req.params.id);
            return res.status(StatusCodes.OK).json({
                status: 'success',
                message: 'Category deleted successfully.',
            });
        }
        catch(error) {
            throw new BadRequestError('Error when deleting category.');
        }
    }
}

export default new CategoryController();