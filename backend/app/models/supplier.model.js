import connectDB from './../db/index.js';
import Validator from './validator.js';
import extractData from './../utils/extractData.util.js';
import formatDateToString from './../utils/formatDateToString.util.js';

const connection = await connectDB();
connection.config.namedPlaceholders = true;

class SupplierModel {
    constructor() {
        this.table = process.env.TABLE_SUPPLIERS;
        this.fields = ['supplier_name', 'supplier_phone_number', 'supplier_email', 'supplier_address'];
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
                min: 6,
            },
        };
    }
    validateSupplierData(data, exceptions = []) {
        const supplier = extractData(data, this.fields);
        const schema = {};
        Object.keys(this.schema).map(key => {
            if(!exceptions.includes(key)) {
                schema[key] = this.schema[key];
            }
        });
        const validator = new Validator();
        let { result, errors } = validator.validate(supplier, schema);
        if(!data.supplier_id) {
            result['supplier_deleted_at'] = null;
        }
        return { result, errors };
    }
    // get all
    async getAll() {
        const preparedStmt = `select * from ${this.table} where supplier_deleted_at is null`;
        const [rows] = await connection.execute(preparedStmt);
        return (rows.length > 0) ? rows : [];
    }
    // get
    async get(id) {
        const preparedStmt = `select * from ${this.table} where supplier_id = :supplier_id and supplier_deleted_at is null`;
        const [rows] = await connection.execute(preparedStmt, {
            supplier_id: id,
        });
        return (rows.length > 0) ? rows[0] : null;
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
    async update(id, payload) {
        let exceptions= [];
        Object.keys(this.schema).forEach(key => {
            if(!payload.hasOwnProperty(key)) {
                exceptions.push(key);
            }
        });
        const { result: supplier, errors } = this.validateSupplierData({
            ...payload,
            supplier_id: id,
        }, exceptions);
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
        await connection.execute(`update ${this.table} set supplier_deleted_at = :deleted_at where supplier_id = :supplier_id`, {
            deleted_at: formatDateToString(),
            supplier_id: id,
        });
    }
}

export default SupplierModel;