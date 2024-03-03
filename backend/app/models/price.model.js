import connectDB from './../db/index.js';
import Validator from './validator.js';

const connection = await connectDB();
connection.config.namedPlaceholders = true;

class PriceModel {
    constructor() {
        this.table = process.env.TABLE_PRICES;
        this.schema = {
            price_value: {
                required: true,
                toFixed: 2,
            },
        };
    }
    validatePriceData(data) {
        const price = {
            product_id: data.product_id,
            price_value: data.price_value,
            price_applied_date: data.price_applied_date,
        }
        Object.keys(price).forEach(key => {
            if(price[key] === undefined) {
                delete price[key];
            }
        });
        const validator = new Validator();
        return validator.validate(price, this.schema);
    }
    async retrieve(product_id, price_applied_date) {
        const preparedStmt = `select * from ${this.table} where product_id = :product_id and price_applied_date = :price_applied_date`;
        const [row] = await connection .execute(preparedStmt, {
            product_id,
            price_applied_date,
        });
        return row;
    }
    async add(data) {
        const { result: price, errors } = this.validatePriceData(data);
        if(errors.length > 0) {
            throw new Error(`${errors.map(error => error.msg).join(' ')}.`);
        }
        price.price_value = parseFloat(price.price_value);
        if(price.product_id && price.price_applied_date) {
            const preparedStmt = `insert into ${this.table} (${Object.keys(price).map(key => `${key}`).join(', ')}) values (${Object.keys(price).map(key => `:${key}`).join(', ')})`;
            await connection.execute(preparedStmt, price);
        }
    }
}

export default PriceModel;