import multer from 'multer';

import ProductModel from './../models/product.model.js';
import uploadImagesProduct from './../utils/uploadImagesProduct.util.js';

class ProductController {
    async index(req, res) {

    }

    async get(req, res) {

    }

    async save(req, res, next) {
        uploadImagesProduct(req, res, async err => {
            if(err instanceof multer.MulterError) {
                return res.status(400).json({
                    status: 'failed',
                    msg: err.message,
                })
            }
            else if(err) {
                return res.status(400).json({
                    status: err.status,
                    msg: err.message
                });
            }
            const imageFiles = req.files.map(file => {
                return file.filename;
            });
            const productModel = new ProductModel();
            await productModel.create({
                ...req.body,
                images: imageFiles,
            });
            next();
        });
    }

    async update(req, res) {

    }

    async delete(req, res) {

    }
}

export default new ProductController();