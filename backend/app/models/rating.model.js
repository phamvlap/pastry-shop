import connectDB from './../db/index.js';
import Validator from './../helpers/validator.js';
import { extractData, formatDateToString, escapeData } from './../utils/index.js';
import { CustomerModel } from './index.js';

const connection = await connectDB();
connection.config.namedPlaceholders = true;

class RatingModel {
    constructor() {
        this.table = process.env.TABLE_RATINGS;
        this.fields = ['customer_id', 'product_id', 'rating_content', 'rating_star'];
        this.schema = {
            customer_id: {
                required: true,
                toInt: true,
            },
            product_id: {
                required: true,
                toInt: true,
            },
            rating_content: {
                type: String,
            },
            rating_star: {
                required: true,
                toInt: true,
            },
        };
    }
    validateRatingData(data) {
        const rating = extractData(data, this.fields);
        const validator = new Validator();
        const { result, errors } = validator.validate(rating, this.schema);
        result['rating_created_at'] = formatDateToString(new Date());
        return { result, errors };
    }
    // get all ratings
    async getAll(filter) {
        const customerModel = new CustomerModel();

        const ratingStarSort = ['asc', 'desc'].includes(filter.rating_star_sort) ? filter.rating_star_sort : null;
        const limit = filter.limit && filter.limit !== 'null' ? '' + filter.limit : null;
        const offset = filter.offset && filter.offset !== 'null' ? '' + filter.offset : '0';

        console.log({
            ratingStarSort,
            limit,
            offset,
        });

        let preparedStmt = `
            select *
            from ${this.table}
        `;
        if (ratingStarSort) {
            preparedStmt += ` order by rating_star ${ratingStarSort}`;
        }
        if (limit) {
            preparedStmt += ` limit :limit offset :offset;`;
        }
        const [rows] = await connection.execute(preparedStmt, {
            limit,
            offset,
        });
        let ratings = [];
        if (rows.length > 0) {
            for (let i = 0; i < rows.length; i++) {
                const customer = await customerModel.getById(rows[i].customer_id);
                ratings.push({
                    ...escapeData(rows[i], ['customer_id']),
                    customer,
                });
            }
        }
        return ratings;
    }
    // get one rating for product and customer
    async getOne(customerId, productId) {
        const preparedStmt = `
            select *
            from ${this.table}
            where customer_id = :customer_id and product_id = :product_id;
        `;
        const [rows] = await connection.execute(preparedStmt, {
            customer_id: customerId,
            product_id: productId,
        });
        return rows.length > 0 ? rows[0] : null;
    }
    // get all rating of product
    async getAllRatingForProduct(productId) {
        const customerModel = new CustomerModel();
        const preparedStmt = `
            select *
            from ${this.table}
            where product_id = :product_id;
        `;
        const [rows] = await connection.execute(preparedStmt, {
            product_id: productId,
        });
        let ratings = [];
        if (rows.length > 0) {
            for (let i = 0; i < rows.length; i++) {
                const customer = await customerModel.getById(rows[i].customer_id);
                ratings.push({
                    ...escapeData(rows[i], ['customer_id']),
                    customer,
                });
            }
        }
        return ratings;
    }
    // add one rating for product
    async add(data) {
        const { result: rating, errors } = this.validateRatingData(data);
        if (errors.length > 0) {
            const errorMessage = errors.map((error) => error.msg).join(' ');
            throw new Error(errorMessage);
        }
        const preparedStmt = `
            insert into ${this.table} (${Object.keys(rating).join(', ')})
                values (${Object.keys(rating)
                    .map((key) => `:${key}`)
                    .join(', ')});
        `;
        await connection.execute(preparedStmt, rating);
    }
}

export default RatingModel;
