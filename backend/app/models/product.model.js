import slugify from 'slugify';
import connectDB from './../db/index.js';
import Validator from './validator.js';
import formatDateToString from '../utils/formatDateToString.util.js';

const connection = await connectDB();
connection.config.namedPlaceholders = true;

class ProductModel {
    constructor() {
        this.table = 'products';
    }
    extractProductData(payload) {
        const product = {
            product_name: payload.name,
            product_stock_quantity: payload.stock_quantity,
            product_description: payload.description,
            product_expire_date: payload.expire_date,
            category_id: payload.category_id,
            discount_id: payload.discount_id,
            supplier_id: payload.supplier_id,
        };
        Object.keys(product).forEach(key => {
            if(product[key] === undefined) {
                delete product[key];
            }
        });
        return product;
    }
    validateProductData(data) {
        const product = this.extractProductData(data);
        const validator = new Validator();
        if(!product.product_id) {
            validator.checkUploadImages('product_images', data.images);
            product.product_images = data.images.map(image => image.filename).join(';');
            product['product_sold_quantity'] = 0;
            product['product_created_at'] = formatDateToString();
            product['product_updated_at'] = formatDateToString();
            product['product_deleted_at'] = null;
        }
        else {
            product['product_updated_at'] = formatDateToString();
        }
        if(product.product_name) {
            validator.isLeastLength('product_name', product.product_name, 3);
            product.product_slug = slugify(product.product_name, {
                replacement: '_',
                lower: true,
                trim: true,
            });
        }
        if(product.product_stock_quantity) {
            product.product_stock_quantity = parseInt(product.product_stock_quantity);
        }
        if(product.product_description) {
            validator.isLeastLength('product_description', product.product_description, 10);
        }
        if(product.product_expire_date) {
            validator.checkValidDate('product_expire_date', product.product_expire_date);
        }
        if(product.category_id) {
            product.category_id = parseInt(product.category_id);
        }
        if(product.discount_id) {
            product.discount_id = parseInt(product.discount_id);
        }
        if(product.supplier_id) {
            product.supplier_id = parseInt(product.supplier_id);
        }
        return {
            product,
            errors: validator.getErrors(),
        }
    }
    async getAll() {
        const [rows] = await connection.execute(`select * from ${this.table} where product_deleted_at is null`);
        return rows;
    }
    async get(id) {
        const [rows] = await connection.execute(`select * from ${this.table} where product_id = :product_id and product_deleted_at is null`, { product_id: id });
        return rows;
    }
    async store(data) {
        const { product, errors } = this.validateProductData(data);
        if(errors.length > 0) {
            throw new Error(errors.map(error => error.msg).join(' '));
        }
        const preparedStmt = `insert into ${this.table} (${Object.keys(product).join(', ')}) values (${Object.keys(product).map(key => `:${key}`).join(', ')})`;
        await connection.execute(preparedStmt, product);
    }
    async update(id, payload) {
        const { product, errors } = this.validateProductData(payload);
        if(errors.length > 0) {
            throw new Error(errors.map(error => error.msg).join(' '));
        }
        const preparedStmt = `update ${this.table} set ${Object.keys(product).map(key => `${key} = :${key}`).join(', ')} where product_id = :product_id`;
        await connection.execute(preparedStmt, {
            ...product,
            product_id: id,
        });
    }
    async delete(id) {
        await connection.execute(`update ${this.table} set product_deleted_at = :deleted_at where product_id = :product_id`, {
            deleted_at: formatDateToString(),
            product_id: id,
        });
    }
}

export default ProductModel;