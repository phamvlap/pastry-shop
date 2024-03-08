import connectDB from './../db/index.js';
import Validator from './validator.js';
import formatDateToString from './../utils/formatDateToString.util.js';
import escapeData from './../utils/escapeData.util.js';
import extractData from './../utils/extractData.util.js';

const connection = await connectDB();
connection.config.namedPlaceholders = true;

class AddressModel {
    constructor() {
        this.table = process.env.TABLE_ADDRESSES;
        this.fields = ['address_fullname', 'address_phone_number', 'address_detail', 'customer_id'];
        this.schema = {
            address_fullname: {
                type: String,
                required: true,
                min: 3,
            },
            address_phone_number: {
                type: String,
                required: true,
                phoneNumber: true,
            },
            address_detail: {
                type: String,
                required: true,
                min: 5,
            },
            customer_id: {
                required: true,
                toInt: true,
            },
        };
    }
    validateAddressData(data, exceptions = []) {
        const address = extractData(data, this.fields);
        const validator = new Validator();
        const schema = {};
        Object.keys(this.schema).map(key => {
            if(!exceptions.includes(key)) {
                schema[key] = this.schema[key];
            }
        });
        let { result, errors } = validator.validate(address, schema);
        if(!data.address_id) {
            result.address_deleted_at = null;
        }
        return { result, errors };
    }
    async get(customerId) {
        const preparedStmt = `select * from ${this.table} where customer_id = :customer_id and address_deleted_at is null`;
        const [rows] = await connection.execute(preparedStmt, {
            customer_id: customerId,
        });
        return (rows.length === 0) ? [] : rows.map(row => escapeData(row, ['address_deleted_at', 'customer_id']));        
    }
    async getOneAddress(addressId) {
        const preparedStmt = `select * from ${this.table} where address_id = :address_id and address_deleted_at is null`;
        const [rows] = await connection.execute(preparedStmt, {
            address_id: addressId,
        });
        return (rows.length > 0) ? escapeData(rows[0], ['address_deleted_at', 'customer_id']) : null;
    }
    async store(data) {
        const { result: address, errors } = this.validateAddressData(data);
        if(errors.length > 0) {
            const errorMessage = errors.map(error => error.msg).join(' ');
            throw new Error(errorMessage);
        }
        const preparedStmt = `insert into ${this.table} (${Object.keys(address).map(key => `${key}`).join(', ')}) values (${Object.keys(address).map(key => `:${key}`)})`;
        await connection.execute(preparedStmt, address);
    }
    async update(addressId, payload) {
        const oldAddress = await this.getOneAddress(addressId);
        if(!oldAddress) {
            throw new Error('Address is not found.');
        }
        let exceptions= [];
        Object.keys(this.schema).forEach(key => {
            if(!payload.hasOwnProperty(key)) {
                exceptions.push(key);
            }
        });
        const { result: address, errors } = this.validateAddressData(payload, exceptions);
        if(errors.length > 0) {
            const errorMessage = errors.map(error => error.msg).join(' ');
            throw new Error(errorMessage);
        }
        const preparedStmt = `update ${this.table} set ${Object.keys(address).map(key => `${key} = :${key}`).join(', ')} where address_id = :address_id`;
        await connection.execute(preparedStmt, {
                ...address,
                address_id: addressId,
            });
    }
    // delete
    async delete(addressId) {
        const oldAddress = await this.getOneAddress(addressId);
        if(!oldAddress) {
            throw new Error('Address is not found.');
        }
        const preparedStmt = `update ${this.table} set address_deleted_at = :deleted_at where address_id = :address_id`;
        await connection.execute(preparedStmt, {
            deleted_at: formatDateToString(new Date()),
            address_id: addressId,
        });
    }
}

export default AddressModel;