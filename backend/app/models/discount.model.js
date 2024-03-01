import connectDB from './../db/index.js';
import Validator from './validator.js';

const connection = await connectDB();
connection.config.namedPlaceholders = true;

class Discount {
    constructor() {
        this.table = 'discounts';
    }
    extractDiscountData(payload) {
        const discount = {
            discount_code: payload.code,
            discount_rate: payload.rate,
            discount_limit: payload.limit,
            discount_start: payload.start,
            discount_end: payload.end,
        };
        Object.keys(discount).forEach(key => {
            if(discount[key] === undefined) {
                delete discount[key];
            }
        });
        return discount;
    }
    validateDiscountData(data) {
        const discount = this.extractDiscountData(data);
        const validator = new Validator();
        if(discount.discount_code) {
            validator.length('discount_code', discount.discount_code, 5, 20);
        }
        if(discount.discount_start && discount.discount_end) {
            validator.checkPeriod('discount_start', 'discount_end', discount.discount_start, discount.discount_end);
        }

        const errors = validator.getErrors();

        if(discount.discount_code) {
            discount.discount_code = discount.discount_code.toUpperCase();
        }
        if(discount.discount_rate) {
            discount.discount_rate = parseFloat(discount.discount_rate).toFixed(2);
        }
        if(discount.discount_limit) {
            discount.discount_limit = parseInt(discount.discount_limit);
        }

        return { discount, errors };
    }
    // get all
    async getAll() {
        const preparedStmt = `select * from ${this.table}`;
        const [rows] = await connection.execute(preparedStmt);
        return rows;
    }
    // get
    async get(id) {
        const preparedStmt = `select * from ${this.table} where discount_id = :discount_id`;
        const [rows] = await connection.execute(preparedStmt, {
            discount_id: id,
        });
        return rows;
    }
    // create
    async create(data) {
        const { discount, errors } = this.validateDiscountData(data);
        if(errors.length > 0) {
            const errorMessage = errors.map(error => error.msg).join(' ');
            throw new Error(errorMessage);
        }
        const preparedStmt = `insert into ${this.table} (${Object.keys(discount).join(', ')}) values (${Object.keys(discount).map(key => `:${key}`).join(', ')})`;
        connection.execute(preparedStmt, discount);
    }
    // update
    async update(id, data) {
        const { discount, errors } = this.validateDiscountData(data);
        if(errors.length > 0) {
            const errorMessage = errors.map(error => error.msg).join(' ');
            throw new Error(errorMessage);
        }
        const preparedStmt = `update ${this.table} set ${Object.keys(discount).map(key => `${key} = :${key}`).join(', ')} where discount_id = :discount_id`;
        connection.execute(preparedStmt, {
                ...discount,
                discount_id: id,
            });
    }
    // delete
    async delete(id) {
        const preparedStmt = `delete from ${this.table} where discount_id = :discount_id`;
        connection.execute(preparedStmt, {
            discount_id: id,
        });
    }
}

export default Discount;