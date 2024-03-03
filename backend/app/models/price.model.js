import connectDB from './../db/index.js';

const connection = await connectDB();
connection.config.namedPlaceholders = true;

class PriceModel {
    constructor() {
        this.table = process.env.TABLE_PRICES;
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
        return price;
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
        const price = this.validatePriceData(data);
        price.price_value = parseFloat(price.price_value);
        if(price.product_id && price.price_applied_date) {
            const preparedStmt = `insert into ${this.table} (${Object.keys(price).map(key => `${key}`).join(', ')}) values (${Object.keys(price).map(key => `:${key}`).join(', ')})`;
            await connection.execute(preparedStmt, price);
        }
    }
}

export default PriceModel;