import connectDB from './../db/index.js';

const connection = await connectDB();
connection.config.namedPlaceholders = true;

class PaymentMethodModel {
    constructor() {
        this.table = process.env.TABLE_PAYMENT_METHODS;
    }
    async getAll() {
        const [rows] = await connection.execute(`
            select *
            from ${this.table}
        `);
        return rows.length > 0 ? rows : null;
    }
    async get(id) {
        const [rows] = await connection.execute(
            `
            select *
            from ${this.table}
            where pm_id = :pm_id
        `,
            {
                pm_id: id,
            },
        );
        return rows.length > 0 ? rows[0] : null;
    }
}

export default PaymentMethodModel;
