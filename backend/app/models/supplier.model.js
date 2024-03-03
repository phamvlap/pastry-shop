import connectDB from './../db/index.js';
import Validator from './validator.js';

const connection = await connectDB();
connection.config.namedPlaceholders = true;

class Supplier {
    constructor() {
        this.table = process.env.TABLE_SUPPLIERS;
        this.schema = {
            supplier_name: {
                type: String,
                required: true,
                min: 3,
            },
            supplier_phone_number: {
                type: String,
                required: true,
                phoneNumber: true,
            },
            supplier_email: {
                type: String,
                required: true,
                email: true,
            },
            supplier_address: {
                type: String,
                required: true,
            },
        };
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
    validateSupplierData(data) {
        const supplier = this.extractSupplierData(data);
        const validator = new Validator();
        return validator.validate(supplier, this.schema);
    }
    // get all
    async getAll() {
        const preparedStmt = `select * from ${this.table}`;
        const [rows] = await connection.execute(preparedStmt);
        return rows;
    }
    // get
    async get(id) {
        const preparedStmt = `select * from ${this.table} where supplier_id = :supplier_id`;
        const [row] = await connection.execute(preparedStmt, {
            supplier_id: id,
        });
        return row;
    }
    // create
    async create(data) {
        const { result: supplier, errors } = this.validateSupplierData(data);
        if(errors.length > 0) {
            const errorMessage = errors.map(error => error.msg).join(' ');
            throw new Error(errorMessage);
        }
        const preparedStmt = `insert into ${this.table} (${Object.keys(supplier).join(', ')}) values (${Object.keys(supplier).map(key => `:${key}`).join(', ')})`;
        await connection.execute(preparedStmt, supplier);
    }
    // update
    async update(id, data) {
        const { result: supplier, errors } = this.validateSupplierData(data);
        if(errors.length > 0) {
            const errorMessage = errors.map(error => error.msg).join(' ');
            throw new Error(errorMessage);
        }
        const preparedStmt = `update ${this.table} set ${Object.keys(supplier).map(key => `${key} = :${key}`).join(', ')} where supplier_id = :supplier_id`;
        await connection.execute(preparedStmt, {
                ...supplier,
                supplier_id: id,
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

export default Supplier;