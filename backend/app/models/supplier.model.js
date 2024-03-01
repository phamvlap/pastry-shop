import connectDB from './../db/index.js';

const connection = await connectDB();
connection.config.namedPlaceholders = true;

class Supplier {
    constructor() {
        this.table = 'suppliers';
    }
    extractSupplierData(payload) {
        const supplier = {
            supplier_name: payload.name,
            supplier_phone_number: payload.phone_number,
            supplier_email: payload.email,
            supplier_address: payload.address,
        };
        Object.keys(supplier).forEach(key => {
            if(supplier[key] === undefined) {
                delete supplier[key];
            }
        });
        return supplier;
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
            const discount = this.extractSupplierData(data);
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
            const discount = this.extractSupplierData(data);
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