import connectDB from './../db/index.js';
import Validator from './validator.js';
import formatDateToString from '../utils/formatDateToString.util.js';
import PriceModel from './price.model.js';
import CategoryModel from './category.model.js';
import SupplierModel from './supplier.model.js';
import DiscountModel from './discount.model.js';

const connection = await connectDB();
connection.config.namedPlaceholders = true;

class ProductModel {
    constructor() {
        this.table = process.env.TABLE_PRODUCTS;
        this.schema = {
            product_name: {
                type: String,
                required: true,
                min: 3,
                slug: true,
            },
            product_stock_quantity: {
                required: true,
                toInt: true,
            },
            product_description: {
                type: String,
                required: true,
                min: 10,
            },
            product_expire_date: {
                type: Date,
                required: true,
            },
            category_id: {
                required: true,
                toInt: true,
            },
            discount_id: {
                required: true,
                toInt: true,
            },
            supplier_id: {
                required: true,
                toInt: true,
            },
        };
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
        let { result, errors } = validator.validate(product, this.schema);
        if(!data.product_id) {
            result['product_images'] = validator.checkUploadImages('product_images', data.images);
            result['product_sold_quantity'] = 0;
            result['product_created_at'] = formatDateToString();
            result['product_updated_at'] = formatDateToString();
            result['product_deleted_at'] = null;
        }
        else {
            result['product_updated_at'] = formatDateToString();
        }
        return { result, errors };
    }
    async getAll() {
        const categoryModel = new CategoryModel();
        const supplierModel = new SupplierModel();
        const discountModel = new DiscountModel();
        const priceModel = new PriceModel();

        const [rows] = await connection.execute(`select * from ${this.table} where product_deleted_at is null`);
        let products = [];
        for(const row of rows) {
            const [category] = await categoryModel.get(row.category_id);
            const [supplier] = await supplierModel.get(row.supplier_id);
            const [discount] = await discountModel.get(row.discount_id);
            const [price] = await priceModel.retrieve(row.product_id, row.product_updated_at);
            delete price.product_id;

            products.push({
                ...row,
                category,
                supplier,
                discount,
                price,
            });
        }
        return products;
    }
    async get(id) {
        const categoryModel = new CategoryModel();
        const supplierModel = new SupplierModel();
        const discountModel = new DiscountModel();
        const priceModel = new PriceModel();

        const [rows] = await connection.execute(`select * from ${this.table} where product_id = :product_id and product_deleted_at is null`, { product_id: id });
        const row = rows[0];
        const [category] = await categoryModel.get(row.category_id);
        const [supplier] = await supplierModel.get(row.supplier_id);
        const [discount] = await discountModel.get(row.discount_id);
        const [price] = await priceModel.retrieve(row.product_id, row.product_updated_at);
        delete price.product_id;

        return {
            ...row,
            category,
            supplier,
            discount,
            price,
        };
    }
    async getOneNewest() {
        const [row] = await connection.execute(`select * from ${this.table} where product_deleted_at is null order by product_updated_at desc limit 1`);
        return row;
    }
    async store(data) {
        const { result: product, errors } = this.validateProductData(data);
        if(errors.length > 0) {
            throw new Error(errors.map(error => error.msg).join(' '));
        }
        const preparedStmt = `insert into ${this.table} (${Object.keys(product).join(', ')}) values (${Object.keys(product).map(key => `:${key}`).join(', ')})`;
        await connection.execute(preparedStmt, product);
        const newestProduct = await this.getOneNewest();
        const price = {
            product_id: newestProduct[0].product_id,
            price_applied_date: newestProduct[0].product_updated_at,
            price_value: data.price,
        };
        const priceModel = new PriceModel();
        await priceModel.add(price);
    }
    async update(id, payload) {
        const { product, errors } = this.validateProductData({
            ...payload,
            product_id: id,
        });
        if(errors.length > 0) {
            throw new Error(errors.map(error => error.msg).join(' '));
        }
        const preparedStmt = `update ${this.table} set ${Object.keys(product).map(key => `${key} = :${key}`).join(', ')} where product_id = :product_id`;
        await connection.execute(preparedStmt, {
            ...product,
            product_id: id,
        });
        const [newestProduct] = await this.getOneNewest();
        const price = {
            product_id: newestProduct.product_id,
            price_applied_date: newestProduct.product_updated_at,
            price_value: payload.price,
        };
        const priceModel = new PriceModel();
        await priceModel.add(price);
    }
    async delete(id) {
        await connection.execute(`update ${this.table} set product_deleted_at = :deleted_at where product_id = :product_id`, {
            deleted_at: formatDateToString(),
            product_id: id,
        });
    }
}

export default ProductModel;