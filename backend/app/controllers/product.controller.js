import { unlink } from 'fs/promises';
import multer from 'multer';
import { StatusCodes } from 'http-status-codes';
import { ProductModel } from './../models/index.js';
import { BadRequestError } from './../errors/index.js';
import { uploadProductImages } from './../utils/index.js';

class ProductController {
    async index(req, res, next) {
        try {
            const productModel = new ProductModel();
            const products = await productModel.getAll(
                req.query.product_name,
                req.query.product_slug,
                req.query.category_id,
                req.query.supplier_id,
                req.query.discount_id,
                req.query.createdAtOrder, // asc, desc
                req.query.priceOrder, // asc, desc
                req.query.status, // all, in-stock, out-stock
                req.query.limit,
                req.query.offset,
            );
            res.status(StatusCodes.OK).json({
                status: 'success',
                data: products,
            });
        } catch (error) {
            next(new BadRequestError(error.message));
        }
    }
    async getById(req, res, next) {
        try {
            const productModel = new ProductModel();
            const product = await productModel.getById(req.params.id);
            res.status(StatusCodes.OK).json({
                status: 'success',
                data: product,
            });
        } catch (error) {
            next(new BadRequestError(error.message));
        }
    }
    async getCount(req, res, next) {
        try {
            const productModel = new ProductModel();
            const count = await productModel.getCount(
                req.query.product_name,
                req.query.category_id,
                req.query.supplier_id,
                req.query.discount_id,
                req.query.status, // all, in-stock, out-stock
            );
            res.status(StatusCodes.OK).json({
                status: 'success',
                data: count,
            });
        } catch (error) {
            next(new BadRequestError(error.message));
        }
    }
    async create(req, res, next) {
        uploadProductImages(req, res, async (err) => {
            if (err instanceof multer.MulterError) {
                if (req.files?.length > 0) {
                    req.files.forEach(async (file) => {
                        try {
                            await unlink(file.path);
                        } catch (err) {
                            return next(new BadRequestError(err.message));
                        }
                    });
                }
                return next(new BadRequestError(err.message));
            } else if (err) {
                req.files.forEach(async (file) => {
                    try {
                        await unlink(file.path);
                    } catch (err) {
                        return next(new BadRequestError(err.message));
                    }
                });
                return next(new BadRequestError(err.message));
            }
            if (req.files?.length > 0) {
                req.body['product_images'] = [...req.files];
            }
            try {
                const productModel = new ProductModel();
                await productModel.store(req.body);
                res.status(StatusCodes.OK).json({
                    status: 'success',
                    message: 'Product created successfully',
                });
            } catch (error) {
                if (req.files?.length > 0) {
                    req.files.forEach(async (file) => {
                        try {
                            await unlink(file.path);
                        } catch (err) {
                            return next(new BadRequestError(err.message));
                        }
                    });
                }
                next(new BadRequestError(error.message));
            }
        });
    }
    async update(req, res, next) {
        uploadProductImages(req, res, async (err) => {
            if (err instanceof multer.MulterError) {
                if (req.files?.length > 0) {
                    req.files.forEach(async (file) => {
                        try {
                            await unlink(file.path);
                        } catch (err) {
                            return next(new BadRequestError(err.message));
                        }
                    });
                }
                return next(new BadRequestError(err.message));
            } else if (err) {
                req.files.forEach(async (file) => {
                    try {
                        await unlink(file.path);
                    } catch (err) {
                        return next(new BadRequestError(err.message));
                    }
                });
                return next(new BadRequestError(err.message));
            }
            if (req.files?.length > 0) {
                req.body['product_images'] = [...req.files];
            }
            try {
                const productModel = new ProductModel();
                await productModel.update(req.params.id, req.body);
                res.status(StatusCodes.OK).json({
                    status: 'success',
                    message: 'Product updated successfully',
                });
            } catch (error) {
                if (req.files?.length > 0) {
                    req.files.forEach(async (file) => {
                        try {
                            await unlink(file.path);
                        } catch (err) {
                            return next(new BadRequestError(err.message));
                        }
                    });
                }
                next(new BadRequestError(error.message));
            }
        });
    }
    async delete(req, res, next) {
        try {
            const productModel = new ProductModel();
            await productModel.delete(req.params.id);
            res.status(StatusCodes.OK).json({
                status: 'success',
                message: 'Product deleted successfully',
            });
        } catch (error) {
            next(new BadRequestError(error.message));
        }
    }
}

export default new ProductController();
