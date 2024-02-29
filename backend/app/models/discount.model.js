import connectDB from './../db/index.js';

const connection = await connectDB();
connection.config.namedPlaceholders = true;

class Discount {
    constructor() {
        this.table = 'discounts';
    }
    extractDiscountData(payload) {
        const discount = {
            discount_code: payload.code?.toUpperCase(),
            discount_rate: Math.round(parseFloat(payload.rate) * 100) / 100,
            discount_limit: parseInt(payload.limit),
            discount_start: payload.start,
            discount_end: payload.end,
        };
        Object.keys(discount).forEach(key => {
            if(discount[key] === undefined || isNaN(discount[key])) {
                delete discount[key];
            }
        });
        return discount;
    }
    // get all
    async getAll() {
        try {
            const preparedStmt = `select * from ${this.table}`;
            const [rows] = await connection.execute(preparedStmt);
            return rows;
        }
        catch(error) {
            console.log(error);
        }
    }
    // get
    async get() {
        try {
            const preparedStmt = `select * from ${this.table} where discount_id = :discount_id`;
            const [rows] = await connection.execute(preparedStmt, {
                discount_id: id,
            });
            return rows;
        }
        catch(error) {
            console.log(error);
        }
    }
    // create
    async create(data) {
        try {
            const discount = this.extractDiscountData(data);
            const preparedStmt = `insert into ${this.table} (${Object.keys(discount).join(', ')}) values (${Object.keys(discount).map(key => `:${key}`).join(', ')})`;
            connection.execute(preparedStmt, discount, (error, rows) => {
                console.log(rows);
            });
        }
        catch(error) {
            console.log(error);
        }
    }
    // update
    async update(id, data) {
        try {
            const discount = this.extractDiscountData(data);
            console.log(discount)
            const preparedStmt = `update ${this.table} set ${Object.keys(discount).map(key => `${key} = :${key}`).join(', ')} where discount_id = :discount_id`;
            connection.execute(preparedStmt, {
                    ...discount,
                    discount_id: id,
                }, (error, rows) => {
                        console.log(rows);
                });
        }
        catch(error) {
            console.log(error);
        }
    }
    // delete
    async delete(id) {
        try {
            const preparedStmt = `delete from ${this.table} where discount_id = :discount_id`;
            connection.execute(preparedStmt, {
                discount_id: id,
            }, (err, rows) => {
                console.log(rows);
            });
        }
        catch(error) {
            console.log(error);
        }
    }
}

export default Discount;