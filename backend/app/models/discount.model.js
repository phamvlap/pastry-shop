import connectDB from './../db/index.js';
import Validator from './../helpers/validator.js';
import { extractData } from './../utils/index.js';

const connection = await connectDB();
connection.config.namedPlaceholders = true;

class DiscountModel {
    constructor() {
        this.table = process.env.TABLE_DISCOUNTS;
        this.fields = ['discount_code', 'discount_rate', 'discount_limit', 'discount_start', 'discount_end'];
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
    validateDiscountData(data, exceptions = []) {
        const discount = extractData(data, this.fields);
        const schema = {};
        Object.keys(this.schema).map(key => {
            if(!exceptions.includes(key)) {
                schema[key] = this.schema[key];
            }
        });
        const validator = new Validator();
        return validator.validate(discount, schema);
    }
    // get all
    async getAll() {
        const preparedStmt = `select * from ${this.table}`;
        const [rows] = await connection.execute(preparedStmt);
        return (rows.length > 0) ? rows : [];
    }
    // get by id
    async get(id) {
        const preparedStmt = `select * from ${this.table} where discount_id = :discount_id`;
        const [rows] = await connection.execute(preparedStmt, {
            discount_id: id,
        });
        return (rows.length > 0) ? rows[0] : null;
    }
    // create
    async store(data) {
        const { result: discount, errors } = this.validateDiscountData(data);
        if(errors.length > 0) {
            const errorMessage = errors.map(error => error.msg).join(' ');
            throw new Error(errorMessage);
        }
        const preparedStmt = `insert into ${this.table} (${Object.keys(discount).join(', ')}) values (${Object.keys(discount).map(key => `:${key}`).join(', ')})`;
        await connection.execute(preparedStmt, discount);
    }
    // update
    async update(id, payload) {
        let exceptions= [];
        Object.keys(this.schema).forEach(key => {
            if(!payload.hasOwnProperty(key)) {
                exceptions.push(key);
            }
        });
        const { result: discount, errors } = this.validateDiscountData(payload, exceptions);
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
}

export default DiscountModel;