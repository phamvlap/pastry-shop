import { unlink } from 'fs/promises';
import fs from 'fs';

import connectDB from './../db/index.js';
import Validator from './../helpers/validator.js';
import { PriceModel, CategoryModel, SupplierModel, DiscountModel, ImageModel, RatingModel } from './index.js';
import { formatDateToString, escapeData, extractData } from './../utils/index.js';

const connection = await connectDB();
connection.config.namedPlaceholders = true;

class ProductModel {
    constructor() {
        this.table = process.env.TABLE_PRODUCTS;
        this.fields = [
            'product_name',
            'product_images',
            'product_stock_quantity',
            'product_description',
            'product_expire_date',
            'category_id',
            'discount_id',
            'supplier_id',
            'product_sold_quantity',
            'product_created_at',
            'product_updated_at',
            'product_deleted_at',
            'product_price',
        ];
        this.schema = {
            product_name: {
                type: String,
                required: true,
                min: 3,
                slug: true,
            },
            product_images: {
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
        Object.keys(this.schema).map((key) => {
            if (!exceptions.includes(key)) {
                schema[key] = this.schema[key];
            }
        });
        const validator = new Validator();
        let { result, errors } = validator.validate(product, schema);
        if (!data.product_id) {
            result['product_sold_quantity'] = 0;
            result['product_created_at'] = formatDateToString(new Date());
            result['product_updated_at'] = formatDateToString(new Date());
            result['product_deleted_at'] = process.env.TIME_NOT_DELETED;
        } else {
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
        const imageModel = new ImageModel();
        const ratingModel = new RatingModel();

        const category = await categoryModel.get(item.category_id);
        const supplier = await supplierModel.getById(item.supplier_id);
        const discount = await discountModel.getById(item.discount_id);
        const price = await priceModel.getNewest(item.product_id);
        const images = await imageModel.getAll('product', item.product_id);
        const ratings = await ratingModel.getAllRatingForProduct(item.product_id);

        return {
            ...escapeData(item, ['category_id', 'discount_id', 'supplier_id', 'product_deleted_at']),
            category,
            supplier,
            discount,
            price: {
                ...escapeData(price, ['product_id']),
            },
            ratings: ratings,
            images: images,
        };
    }
    // get all products by filter
    async getAll(
        product_name,
        product_slug,
        category_id,
        supplier_id,
        discount_id,
        createdAtOrder, // asc, desc
        priceOrder, // asc, desc
        status, // all, in-stock, out-stock
        limit,
        offset,
    ) {
        const parseProductName = product_name ? product_name : '';
        const parseProductSlug = product_slug ? product_slug : '';
        const parseCategoryId = category_id ? category_id : null;
        const parseSupplierId = supplier_id ? supplier_id : null;
        const parseDiscountId = discount_id ? discount_id : null;
        const parseCreatedAtOrder = createdAtOrder ? createdAtOrder : 'desc';
        const parsePriceOrder = priceOrder ? priceOrder : 'asc';
        const parseStatus = status ? status : 'all';
        const parseLimit = limit ? '' + limit : '' + process.env.MAX_LIMIT;
        const parseOffset = offset ? '' + offset : '0';

        let preparedStmt = `
            select *
            from ${this.table} as p
            where product_deleted_at = '${process.env.TIME_NOT_DELETED}'
                and (:product_name is null or p.product_name like :product_name)
                and (:product_slug is null or p.product_slug like :product_slug)
                and (:category_id is null or p.category_id = :category_id)
                and (:supplier_id is null or p.supplier_id = :supplier_id)
                and (:discount_id is null or p.discount_id = :discount_id)
        `;

        if (status === 'in-stock') {
            preparedStmt += ` and p.product_stock_quantity > p.product_sold_quantity`;
        } else if (status === 'out-stock') {
            preparedStmt += ` and p.product_stock_quantity = p.product_sold_quantity`;
        }

        preparedStmt += ` order by
                p.product_created_at ${parseCreatedAtOrder}
            limit :limit offset :offset;
        `;
        const [rows] = await connection.execute(preparedStmt, {
            product_name: `%${parseProductName}%`,
            product_slug: `%${parseProductSlug}%`,
            category_id: parseCategoryId,
            supplier_id: parseSupplierId,
            discount_id: parseDiscountId,
            limit: parseLimit,
            offset: parseOffset,
        });

        let products = [];
        for (const row of rows) {
            const itemDetail = await this.getItemDetail(row);
            products.push(itemDetail);
        }
        if (priceOrder) {
            products.sort((a, b) => {
                if (priceOrder === 'asc') {
                    return a.price.price_value - b.price.price_value;
                }
                return b.price.price_value - a.price.price_value;
            });
        }
        return products;
    }
    // get total product with filter
    async getCount(
        product_name,
        product_slug,
        category_id,
        supplier_id,
        discount_id,
        status, // all, in-stock, out-stock
    ) {
        const products = await this.getAll(
            product_name,
            product_slug,
            category_id,
            supplier_id,
            discount_id,
            null,
            null,
            status,
            null,
            null,
        );
        return products.length;
    }
    // get item by id
    async getById(id) {
        const [rows] = await connection.execute(
            `
            select * from ${this.table}
            where product_id = :product_id
                and product_deleted_at = '${process.env.TIME_NOT_DELETED}';
        `,
            {
                product_id: id,
            },
        );
        const product = rows.length > 0 ? await this.getItemDetail(rows[0]) : null;
        return product;
    }
    // get product by date
    async getByCreatedDate(date) {
        const [rows] = await connection.execute(
            `
            select * from ${this.table}
            where product_created_at = :product_created_at
                and product_deleted_at = '${process.env.TIME_NOT_DELETED}'
        `,
            {
                product_created_at: date,
            },
        );
        return rows.length > 0 ? await this.getItemDetail(rows[0]) : null;
    }
    // create new product
    async store(data) {
        const priceModel = new PriceModel();
        const imageModel = new ImageModel();
        const { result: product, errors } = this.validateProductData(data);
        if (errors.length > 0) {
            throw new Error(errors.map((error) => error.msg).join(' '));
        }
        const price = {
            price_applied_date: product.product_created_at,
            price_value: product.product_price,
        };
        delete product.product_price;
        const images = product.product_images;
        delete product.product_images;

        const preparedStmt = `
            insert into ${this.table} (${Object.keys(product).join(', ')})
                values (${Object.keys(product)
                    .map((key) => `:${key}`)
                    .join(', ')});
        `;
        await connection.execute(preparedStmt, product);

        const addedItem = await this.getByCreatedDate(product.product_created_at);
        price.product_id = addedItem.product_id;

        await priceModel.add(price);

        if (images) {
            images.forEach(async (image) => {
                const imageData = {
                    image_url: image.path,
                    image_target: 'product',
                    belong_id: parseInt(addedItem.product_id),
                };
                await imageModel.store(imageData);
            });
        }
    }
    // update product
    async update(id, payload) {
        const images = payload.product_images;
        delete payload.product_images;

        const oldItem = await this.getById(id);
        if (!oldItem) {
            throw new Error('Product not found.');
        }
        let exceptions = [];
        payload = Object.assign({}, payload);
        Object.keys(this.schema).forEach((key) => {
            if (!payload.hasOwnProperty(key)) {
                exceptions.push(key);
            }
        });
        const { result: product, errors } = this.validateProductData(
            {
                ...payload,
                product_id: id,
            },
            exceptions,
        );
        if (errors.length > 0) {
            throw new Error(errors.map((error) => error.msg).join(' '));
        }
        let priceValue = -1;
        if (product.product_price) {
            priceValue = product.product_price;
            delete product.product_price;
        }
        if (images) {
            const imageModel = new ImageModel();
            const oldImages = await imageModel.getAll('product', oldItem.product_id);

            if (oldImages.length > 0) {
                oldImages.forEach(async (image) => {
                    if (fs.existsSync(image.image_url)) {
                        try {
                            unlink(image.image_url);
                        } catch (error) {
                            throw new Error('Failed to remove old images.');
                        }
                    }
                    await imageModel.delete(image.image_id);
                });
            }

            images.forEach(async (image) => {
                const imageItem = {
                    image_url: image.path,
                    image_target: 'product',
                    belong_id: parseInt(id),
                };
                await imageModel.store(imageItem);
            });
        }
        const preparedStmt = `
            update ${this.table}
            set ${Object.keys(product)
                .map((key) => `${key} = :${key}`)
                .join(', ')}
            where product_id = :product_id
                and product_deleted_at = '${process.env.TIME_NOT_DELETED}';
        `;
        await connection.execute(preparedStmt, {
            ...product,
            product_id: id,
        });
        if (priceValue !== -1) {
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
        const oldItem = await this.getById(id);
        if (!oldItem) {
            throw new Error('Product not found.');
        }
        await connection.execute(
            `
            update ${this.table}
            set product_deleted_at = :deleted_at
            where product_id = :product_id
                and product_deleted_at = '${process.env.TIME_NOT_DELETED}';
        `,
            {
                deleted_at: formatDateToString(),
                product_id: id,
            },
        );
    }
}

export default ProductModel;
