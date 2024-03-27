import { unlink } from 'fs/promises';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import connectDB from './../db/index.js';
import Validator from './../helpers/validator.js';
import { PriceModel, CategoryModel, SupplierModel, DiscountModel } from './index.js';
import { formatDateToString, escapeData, extractData } from './../utils/index.js';

const connection = await connectDB();
connection.config.namedPlaceholders = true;

const dirname = path.dirname(fileURLToPath(import.meta.url));

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
            result['product_created_at'] = formatDateToString(new Date());
            result['product_updated_at'] = formatDateToString(new Date());
            result['product_deleted_at'] = process.env.TIME_NOT_DELETED;
        }
        else {
            result['product_updated_at'] = formatDateToString();
        }
        return { result, errors };
    }
    // get item detail
    async getItemDetail(item) {
        const categoryModel = new CategoryModel();
        const supplierModel = new SupplierModel();
        const discountModel = new DiscountModel();
        const priceModel = new PriceModel();

        const category = await categoryModel.get(item.category_id);
        const supplier = await supplierModel.get(item.supplier_id);
        const discount = await discountModel.get(item.discount_id);
        const price = await priceModel.getNewest(item.product_id);

        return {
            ...escapeData(item, ['category_id', 'discount_id', 'supplier_id', 'product_deleted_at']),
            category,
            supplier,
            discount,
            price: {
                ...escapeData(price, ['product_id']),
            },
        };
    }
    // get all products
    async getAll(queryLimit, queryOffset) {
        let limit = null;
        let offset = null;
        let rows = [];
        if(queryLimit && queryOffset) {
            limit = queryLimit;
            offset = queryOffset;
        }
        let preparedStmt = '';
        if(limit && offset) {
            preparedStmt = `select * from ${this.table} where product_deleted_at = '${process.env.TIME_NOT_DELETED}' limit :limit offset :offset`;
            [rows] = await connection.execute(preparedStmt, {
                limit: limit,
                offset: offset,
            });
        }
        else {
            preparedStmt = `select * from ${this.table} where product_deleted_at = '${process.env.TIME_NOT_DELETED}'`;
            [rows] = await connection.execute(preparedStmt);
        }
        let products = [];
        for(const row of rows) {
            const itemDetail = await this.getItemDetail(row);
            products.push(itemDetail);
        }
        return products;
    }
    // get total products
    async getCount() {
        const [rows] = await connection.execute(`select count(*) as count from ${this.table} where product_deleted_at = '${process.env.TIME_NOT_DELETED}'`);
        return (rows.length > 0) ? rows[0]['count'] : 0;
    }
    // get item by id
    async get(id) {
        const [rows] = await connection.execute(`select * from ${this.table} where product_id = :product_id and product_deleted_at = '${process.env.TIME_NOT_DELETED}'`, {
            product_id: id
        });
        return (rows.length > 0) ? await this.getItemDetail(rows[0]) : null;
    }
    // get product by date
    async getByCreatedDate(date) {
        const [rows] = await connection.execute(`select * from ${this.table} where product_created_at = :product_created_at and product_deleted_at = '${process.env.TIME_NOT_DELETED}'`, {
            product_created_at: date,
        });
        return (rows.length > 0) ? await this.getItemDetail(rows[0]) : null;
    }
    // get count of products by category
    async getCountByCategory(categoryId) {
        const preparedStmt = `select count(*) as count from ${this.table} where category_id = :category_id and product_deleted_at = '${process.env.TIME_NOT_DELETED}'`;
        const [rows] = await connection.execute(preparedStmt, {
            category_id: categoryId,
        });
        return (rows.length > 0) ? rows[0]['count'] : 0;
    }
    // get count of product by discount
    async getCountByDiscount(discountId) {
        const preparedStmt = `select count(*) as count from ${this.table} where discount_id = :discount_id and product_deleted_at = '${process.env.TIME_NOT_DELETED}'`;
        const [rows] = await connection.execute(preparedStmt, {
            discount_id: discountId,
        });
        return (rows.length > 0) ? rows[0]['count'] : 0;
    }
    // get count of products by filter
    async getCountByFilter(status, categoryId) {
        let preparedStmt = '';
        let rows = [];

        if(status === 'all') {
            if(categoryId === 'all') {
                return await this.getCount();
            }
            else {
                preparedStmt = `select count(*) as count from ${this.table} where category_id = :category_id and product_deleted_at = '${process.env.TIME_NOT_DELETED}'`;
                [rows] = await connection.execute(preparedStmt, {
                    category_id: categoryId,
                });
            }
        }
        else if(status === 'in-stock') {
            if(categoryId === 'all') {
                preparedStmt = `select count(*) as count from ${this.table} where product_stock_quantity > product_sold_quantity and product_deleted_at = '${process.env.TIME_NOT_DELETED}'`;
                [rows] = await connection.execute(preparedStmt);
            }
            else {
                preparedStmt = `select count(*) as count from ${this.table} where product_stock_quantity > product_sold_quantity and category_id = :category_id and product_deleted_at = '${process.env.TIME_NOT_DELETED}'`;
                [rows] = await connection.execute(preparedStmt, {
                    category_id: categoryId,
                });
            }
        }
        else if(status === 'out-stock') {
            if(categoryId === 'all') {
                preparedStmt = `select count(*) as count from ${this.table} where product_stock_quantity = product_sold_quantity and product_deleted_at = '${process.env.TIME_NOT_DELETED}'`;
                [rows] = await connection.execute(preparedStmt);
            }
            else {
                preparedStmt = `select count(*) as count from ${this.table} where product_stock_quantity = product_sold_quantity and category_id = :category_id and product_deleted_at = '${process.env.TIME_NOT_DELETED}'`;
                [rows] = await connection.execute(preparedStmt, {
                    category_id: categoryId,
                });
            }
        }

        return (rows.length > 0) ? rows[0]['count'] : 0;
    }
    // get products by filter: category and status
    async getProductsByFilter(status, categoryId, limit, offset) {
        let preparedStmt = '';
        let rows = [];

        if(status === 'all') {
            if(categoryId === 'all') {
                return await this.getAll(limit, offset);
            }
            else {
                preparedStmt = `select * from ${this.table} where category_id = :category_id and product_deleted_at = '${process.env.TIME_NOT_DELETED}' limit :limit offset :offset`;
                [rows] = await connection.execute(preparedStmt, {
                    category_id: categoryId,
                    limit: limit,
                    offset: offset,
                });
            }
        }
        else if(status === 'in-stock') {
            if(categoryId === 'all') {
                preparedStmt = `select * from ${this.table} where product_stock_quantity > product_sold_quantity and product_deleted_at = '${process.env.TIME_NOT_DELETED}' limit :limit offset :offset`;
                [rows] = await connection.execute(preparedStmt, {
                    limit: limit,
                    offset: offset,
                });
            }
            else {
                preparedStmt = `select * from ${this.table} where product_stock_quantity > product_sold_quantity and category_id = :category_id and product_deleted_at = '${process.env.TIME_NOT_DELETED}' limit :limit offset :offset`;
                [rows] = await connection.execute(preparedStmt, {
                    category_id: categoryId,
                    limit: limit,
                    offset: offset,
                });
            }
        }
        else if(status === 'out-stock') {
            if(categoryId === 'all') {
                preparedStmt = `select * from ${this.table} where product_stock_quantity = product_sold_quantity and product_deleted_at = '${process.env.TIME_NOT_DELETED}' limit :limit offset :offset`;
                [rows] = await connection.execute(preparedStmt, {
                    limit: limit,
                    offset: offset,
                });
            }
            else {
                preparedStmt = `select * from ${this.table} where product_stock_quantity = product_sold_quantity and category_id = :category_id and product_deleted_at = '${process.env.TIME_NOT_DELETED}' limit :limit offset :offset`;
                [rows] = await connection.execute(preparedStmt, {
                    category_id: categoryId,
                    limit: limit,
                    offset: offset,
                });
            }
        }

        let products = [];
        for(const row of rows) {
            const itemDetail = await this.getItemDetail(row);
            products.push(itemDetail);
        }
        return products;
    }
    // create new product
    async store(data) {
        const { result: product, errors } = this.validateProductData(data);
        if(errors.length > 0) {
            throw new Error(errors.map(error => error.msg).join(' '));
        }
        const price = {
            price_applied_date: product.product_created_at,
            price_value: product.product_price,
        };
        delete product.product_price;
        const preparedStmt = `insert into ${this.table} (${Object.keys(product).join(', ')}) values (${Object.keys(product).map(key => `:${key}`).join(', ')})`;
        await connection.execute(preparedStmt, product);
        const addedItem = await this.getByCreatedDate(product.product_created_at);
        price.product_id = addedItem.product_id;
        const priceModel = new PriceModel();
        await priceModel.add(price);
    }
    // update product
    async update(id, payload) {
        const oldItem = await this.get(id);
        if(!oldItem) {
            throw new Error('Product not found.');
        }
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
        let priceValue = -1;
        if(product.product_price) {
            priceValue = product.product_price;
            delete product.product_price;
        }
        const uploadDir = path.join(dirname, '../../public/uploads');
        if(product.product_images) {
            const images = oldItem.product_images.split(';');
            images.forEach(imageName => {
                const imagePath = path.join(uploadDir, 'products', imageName);
                if(fs.existsSync(imagePath)) {
                    try {
                        unlink(imagePath);
                    }
                    catch(error) {
                        throw new Error('Failed to remove old images.');
                    }
                }
            });
        }
        const preparedStmt = `update ${this.table} set ${Object.keys(product).map(key => `${key} = :${key}`).join(', ')} where product_id = :product_id and product_deleted_at = '${process.env.TIME_NOT_DELETED}'`;
        await connection.execute(preparedStmt, {
            ...product,
            product_id: id,
        });
        if(priceValue !== -1) {
            const price = {
                product_id: id,
                price_applied_date: product.product_updated_at,
                price_value: priceValue,
            };
            const priceModel = new PriceModel();
            await priceModel.add(price);
        }
    }
    // delete product
    async delete(id) {
        const oldItem = await this.get(id);
        if(!oldItem) {
            throw new Error('Product not found.');
        }
        await connection.execute(`update ${this.table} set product_deleted_at = :deleted_at where product_id = :product_id and product_deleted_at = '${process.env.TIME_NOT_DELETED}'`, {
            deleted_at: formatDateToString(),
            product_id: id,
        });
    }
}

export default ProductModel;