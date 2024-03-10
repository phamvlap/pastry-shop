import { unlink } from 'fs/promises';
import multer from 'multer';
import { StatusCodes } from 'http-status-codes';
import ProductModel from './../models/product.model.js';
import { BadRequestError } from './../errors/index.js';
import { uploadProductImages } from './../utils/index.js';

class ProductController {
    async index(req, res, next) {
        try {
            const productModel = new ProductModel();
            const products = await productModel.getAll();
            res.status(StatusCodes.OK).json({
                status: 'success',
                data: products,
            });
        }
        catch(error) {
            next(new BadRequestError(error.message));
        }
    }
    async get(req, res, next) {
        try {
            const productModel = new ProductModel();
            const product = await productModel.get(req.params.id);
            res.status(StatusCodes.OK).json({
                status: 'success',
                data: product,
            });
        }
        catch(error) {
            next(new BadRequestError(error.message));
        }
    }
    async create(req, res, next) {
        uploadProductImages(req, res, async err => {
            if(err instanceof multer.MulterError) {
                req.files.forEach(async file => {
                    try {
                        await unlink(file.path);
                    }
                    catch(err) {
                        return next(new BadRequestError(err.message));
                    }
                });
                return next(new BadRequestError(err.message));
            }
            else if(err) {
                req.files.forEach(async file => {
                    try {
                        await unlink(file.path);
                    }
                    catch(err) {
                        return next(new BadRequestError(err.message));
                    }
                });
                return next(new BadRequestError(err.message));
            }
            if(req.files.length > 0) {
                req.body['product_images'] = [ ...req.files ];
            }
            try {
                const productModel = new ProductModel();
                await productModel.store(req.body);
                res.status(StatusCodes.OK).json({
                    status: 'success',
                    message: 'Product created successfully',
                });
            }
            catch(error) {
                req.files.forEach(async file => {
                    try {
                        await unlink(file.path);
                    }
                    catch(err) {
                        return next(new BadRequestError(err.message));
                    }
                });
                next(new BadRequestError(error.message));
            }
        });
    }
    async update(req, res, next) {
        uploadProductImages(req, res, async err => {
            if(err instanceof multer.MulterError) {
                req.files.forEach(async file => {
                    try {
                        await unlink(file.path);
                    }
                    catch(err) {
                        return next(new BadRequestError(err.message));
                    }
                });
                return next(new BadRequestError(err.message));
            }
            else if(err) {
                req.files.forEach(async file => {
                    try {
                        await unlink(file.path);
                    }
                    catch(err) {
                        return next(new BadRequestError(err.message));
                    }
                });
                return next(new BadRequestError(err.message));
            }
            if(req.files.length > 0) {
                req.body['product_images'] = [ ...req.files ];
            }
            try {
                const productModel = new ProductModel();
                await productModel.update(req.params.id, req.body);
                res.status(StatusCodes.OK).json({
                    status: 'success',
                    message: 'Product updated successfully',
                });
            }
            catch(error) {
                req.files.forEach(async file => {
                    try {
                        await unlink(file.path);
                    }
                    catch(err) {
                        return next(new BadRequestError(err.message));
                    }
                });
                next(new BadRequestError(error.message));
            }
        });
    }
    async delete(req, res, next) {
        try {
            const productModel = new ProductModel();
            const products = await productModel.delete(req.params.id);
            res.status(StatusCodes.OK).json({
                status: 'success',
                message: 'Product deleted successfully',
            });
        }
        catch(error) {
            next(new BadRequestError(error.message));
        }
    }
}

export default new ProductController();