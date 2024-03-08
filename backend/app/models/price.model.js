import connectDB from './../db/index.js';
import Validator from './validator.js';
import extractData from './../utils/extractData.util.js';

const connection = await connectDB();
connection.config.namedPlaceholders = true;

class PriceModel {
    constructor() {
        this.table = process.env.TABLE_PRICES;
        this.fields = ['product_id', 'price_value', 'price_applied_date'];
        this.schema = {
            product_id: {
                required: true,
                toInt: true,
            },
            price_value: {
                required: true,
                toFixed: 2,
            },
            price_applied_date: {
                type: Date,
                required: true,
            },
        };
    }
    validatePriceData(data) {
        const price = extractData(data, this.fields);
        const validator = new Validator();
        return validator.validate(price, this.schema);
    }
    async retrieve(product_id, price_applied_date) {
        const preparedStmt = `select * from ${this.table} where product_id = :product_id and price_applied_date = :price_applied_date`;
        const [rows] = await connection .execute(preparedStmt, {
            product_id,
            price_applied_date,
        });
        return (rows.length > 0) ? rows[0] : null;
    }
    async add(data) {
        const { result: price, errors } = this.validatePriceData(data);
        if(errors.length > 0) {
            throw new Error(`${errors.map(error => error.msg).join(' ')}.`);
        }
        const preparedStmt = `insert into ${this.table} (${Object.keys(price).map(key => `${key}`).join(', ')}) values (${Object.keys(price).map(key => `:${key}`).join(', ')})`;
        await connection.execute(preparedStmt, price);
    }
}

export default PriceModel;