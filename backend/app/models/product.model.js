import connectDB from './../db/index.js';
import Validator from './../helpers/validator.js';
import { PriceModel, CategoryModel, SupplierModel, DiscountModel } from './index.js';
import { formatDateToString, escapeData, extractData } from './../utils/index.js';

const connection = await connectDB();
connection.config.namedPlaceholders = true;

class ProductModel {
    constructor() {
        this.table = process.env.TABLE_PRODUCTS;
        this.fields = ['product_name', 'product_images', 'product_stock_quantity', 'product_description', 'product_expire_date', 'category_id', 'discount_id', 'supplier_id', 'product_sold_quantity', 'product_created_at', 'product_updated_at', 'product_deleted_at', 'product_price'];
        this.schema = {
            product_name: {
                type: String,
                required: true,
                min: 3,
                slug: true,
            },
            product_images: {
                type: String,
                required: true,
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
            product_price: {
                required: true,
                toInt: true,
            },
        };
    }
    validateProductData(data, exceptions = []) {
        const product = extractData(data, this.fields);
        const schema = {};
        Object.keys(this.schema).map(key => {
            if(!exceptions.includes(key)) {
                schema[key] = this.schema[key];
            }
        });
        const validator = new Validator();
        if(product.product_images) {
            product.product_images = validator.convertToImagesString('product_images', product.product_images);
        }
        let { result, errors } = validator.validate(product, schema);
        if(!data.product_id) {
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
            const category = await categoryModel.get(row.category_id);
            const supplier = await supplierModel.get(row.supplier_id);
            const discount = await discountModel.get(row.discount_id);
            const price = await priceModel.retrieve(row.product_id, row.product_updated_at);

            products.push({
                ...escapeData(row, ['category_id', 'discount_id', 'supplier_id', 'product_deleted_at']),
                category,
                supplier,
                discount,
                price: {
                    ...escapeData(price, ['product_id']),
                },
            });
        }
        return products;
    }
    async get(id) {
        const categoryModel = new CategoryModel();
        const supplierModel = new SupplierModel();
        const discountModel = new DiscountModel();
        const priceModel = new PriceModel();

        const [rows] = await connection.execute(`select * from ${this.table} where product_id = :product_id and product_deleted_at is null`, {
            product_id: id
        });
        if(rows.length === 0) {
            throw new Error('Product not found.');
        }
        const row = rows[0];
        const category = await categoryModel.get(row.category_id);
        const supplier = await supplierModel.get(row.supplier_id);
        const discount = await discountModel.get(row.discount_id);
        const price = await priceModel.retrieve(row.product_id, row.product_updated_at);

        return {
            ...escapeData(row, ['category_id', 'discount_id', 'supplier_id', 'product_deleted_at']),
            category,
            supplier,
            discount,
            price: {
                ...escapeData(price, ['product_id']),
            },
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
        const priceValue = product.product_price;
        delete product.product_price;
        const preparedStmt = `insert into ${this.table} (${Object.keys(product).join(', ')}) values (${Object.keys(product).map(key => `:${key}`).join(', ')})`;
        await connection.execute(preparedStmt, product);
        const newestItem = await this.getOneNewest();
        const price = {
            product_id: newestItem[0].product_id,
            price_applied_date: newestItem[0].product_updated_at,
            price_value: priceValue,
        };
        const priceModel = new PriceModel();
        await priceModel.add(price);
    }
    async update(id, payload) {
        let exceptions= [];
        payload = Object.assign({}, payload);
        Object.keys(this.schema).forEach(key => {
            if(!payload.hasOwnProperty(key)) {
                exceptions.push(key);
            }
        });
        const { result: product, errors } = this.validateProductData({
            ...payload,
            product_id: id,
        }, exceptions);
        if(errors.length > 0) {
            throw new Error(errors.map(error => error.msg).join(' '));
        }
        let priceValue = 0;
        if(product.product_price) {
            priceValue = product.product_price;
            delete product.product_price;
        }
        const preparedStmt = `update ${this.table} set ${Object.keys(product).map(key => `${key} = :${key}`).join(', ')} where product_id = :product_id`;
        await connection.execute(preparedStmt, {
            ...product,
            product_id: id,
        });
        const price = {
            product_id: id,
            price_applied_date: product.product_updated_at,
            price_value: priceValue,
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