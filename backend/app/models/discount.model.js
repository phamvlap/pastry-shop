import connectDB from './../db/index.js';
import Validator from './validator.js';

const connection = await connectDB();
connection.config.namedPlaceholders = true;

class DiscountModel {
    constructor() {
        this.table = process.env.TABLE_DISCOUNTS;
        this.schema = {
            discount_code: {
                type: String,
                required: true,
                between: [5, 20],
                uppercase: true,
            },
            discount_rate: {
                required: true,
                toFixed: 2,
            },
            discount_limit: {
                required: true,
                toInt: true,
            },
            discount_start: {
                type: Date,
                required: true,
            },
            discount_end: {
                type: Date,
                required: true,
                previousDate: 'discount_start',
            },
        };
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
        return validator.validate(discount, this.schema);
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
        const [row] = await connection.execute(preparedStmt, {
            discount_id: id,
        });
        return row;
    }
    // create
    async create(data) {
        const { result: discount, errors } = this.validateDiscountData(data);
        if(errors.length > 0) {
            const errorMessage = errors.map(error => error.msg).join(' ');
            throw new Error(errorMessage);
        }
        const preparedStmt = `insert into ${this.table} (${Object.keys(discount).join(', ')}) values (${Object.keys(discount).map(key => `:${key}`).join(', ')})`;
        await connection.execute(preparedStmt, discount);
    }
    // update
    async update(id, data) {
        const { result: discount, errors } = this.validateDiscountData(data);
        if(errors.length > 0) {
            const errorMessage = errors.map(error => error.msg).join(' ');
            throw new Error(errorMessage);
        }
        const preparedStmt = `update ${this.table} set ${Object.keys(discount).map(key => `${key} = :${key}`).join(', ')} where discount_id = :discount_id`;
        await connection.execute(preparedStmt, {
                ...discount,
                discount_id: id,
            });
    }
    // delete
    async delete(id) {
        const preparedStmt = `delete from ${this.table} where discount_id = :discount_id`;
        await connection.execute(preparedStmt, {
            discount_id: id,
        });
    }
}

export default DiscountModel;