import connectDB from './../db/index.js';
import Validator from './../helpers/validator.js';
import { extractData } from './../utils/index.js';

const connection = await connectDB();
connection.config.namedPlaceholders = true;

class RatingModel {
    constructor() {
        this.table = process.env.TABLE_CARTS;
        this.fields = ['customer_id', 'product_id', 'rating_created_at', 'rating_content', 'rating_star'];
        this.schema = {
            customer_id: {
                required: true,
                toInt: true,
            },
            product_id: {
                required: true,
                toInt: true,
            },
            rating_created_at: {
                type: Date,
                required: true,
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
        return validator.validate(rating, this.schema);
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
        return (rows.length > 0) ? rows[0] : null;
    }
    // get all rating of product
    async getAllRatingForProduct(productId) {
        const preparedStmt = `
            select *
            from ${this.table}
            where product_id = :product_id;
        `;
        const [rows] = await connection.execute(preparedStmt, {
            product_id: productId,
        });
        return (rows.length > 0) ? rows : [];
    }
    // add one rating for product
    async add(data) {
        const { result: rating, errors } = this.validateRatingData(data);
        if(errors.length > 0) {
            const errorMessage = errors.map(error => error.msg).join(' ');
            throw new Error(errorMessage);
        }
        const preparedStmt = `
            insert into ${this.table} (${Object.keys(rating).join(', ')})
                values (${Object.keys(rating).map(key => `:${key}`).join(', ')});
        `;
        await connection.execute(preparedStmt, rating);
    }
}

export default RatingModel;