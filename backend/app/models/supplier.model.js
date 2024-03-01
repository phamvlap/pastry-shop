import connectDB from './../db/index.js';
import Validator from './validator.js';

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
    validateSupplierData(data) {
        const supplier = this.extractSupplierData(data);
        const validator = new Validator();
        if(validator.supplier_name) {
            validator.isLeastLength('supplier_name', supplier.supplier_name, 3);
        }
        if(validator.supplier_phone_number) {
            validator.isPhoneNumber('supplier_phone_number', supplier.supplier_phone_number);
        }
        if(validator.supplier_email) {
            validator.isEmail('supplier_email', supplier.supplier_email);
        }
        if(validator.supplier_address) {
            validator.isLeastLength('supplier_address', supplier.supplier_address, 3);
        }

        const errors = validator.getErrors();
        return { supplier, errors };
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
        const [rows] = await connection.execute(preparedStmt, {
            supplier_id: id,
        });
        return rows;
    }
    // create
    async create(data) {
        const { supplier, errors } = this.validateSupplierData(data);
        if(errors.length > 0) {
            const errorMessage = errors.map(error => error.msg).join(' ');
            throw new Error(errorMessage);
        }
        const preparedStmt = `insert into ${this.table} (${Object.keys(supplier).join(', ')}) values (${Object.keys(supplier).map(key => `:${key}`).join(', ')})`;
        connection.execute(preparedStmt, supplier);
    }
    // update
    async update(id, data) {
        const { supplier, errors } = this.validateSupplierData(data);
        if(errors.length > 0) {
            const errorMessage = errors.map(error => error.msg).join(' ');
            throw new Error(errorMessage);
        }
        const preparedStmt = `update ${this.table} set ${Object.keys(supplier).map(key => `${key} = :${key}`).join(', ')} where supplier_id = :supplier_id`;
        connection.execute(preparedStmt, {
                ...supplier,
                supplier_id: id,
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

export default Supplier;