import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import connectDB from './../db/index.js';
import Validator from './validator.js';
import formatDateToString from './../utils/formatDateToString.util.js';

const connection = await connectDB();
connection.config.namedPlaceholders = true;

class CustomerModel {
    constructor() {
        this.table = process.env.TABLE_CUSTOMERS;
        this.schema = {
            customer_username: {
                type: String,
                required: true,
                min: 3,
            },
            customer_password: {
                type: String,
                required: true,
                password: true,
            },
            customer_name: {
                type: String,
                required: true,
                min: 3,
            },
            customer_phone_number: {
                type: String,
                required: true,
                phoneNumber: true,
            },
            customer_avatar: {
                type: String,
                required: true,
            },
        };
    }
    extractCustomerData(payload) {
        const customer = {
            customer_username: payload.customer_username,
            customer_password: payload.customer_password,
            customer_name: payload.customer_name,
            customer_phone_number: payload.customer_phone_number,
        };
        Object.keys(customer).forEach(key => {
            if(customer[key] === undefined) {
                delete customer[key];
            }
        });
        return customer;
    }
    validateCustomerData(data) {
        const customer = this.extractCustomerData(data);
        const validator = new Validator();
        let { result, errors } = validator.validate(customer, this.schema);
        if(!data.customer_id) {
            if(data.customer_avatar) {
                result['customer_avatar'] = validator.checkUploadImages('customer_avatar', data.customer_avatar);
            }
            result['customer_deleted_at'] = null;
        }
        if(Object.keys(result).length === 0 && !data.customer_avatar) {
            errors.push({
                msg: 'Please fill in the required fields.',
            });
        }
        return { result, errors };
    }
    escapeData(data, exceptions = []) {
        const escapedData = {};
        Object.keys(data).forEach(key => {
            if(!exceptions.includes(key)) {
                escapedData[key] = data[key];
            }
        });
        return escapedData;
    }
    // get all
    async getAll() {
        const preparedStmt = `select * from ${this.table} where customer_deleted_at is null`;
        const [rows] = await connection.execute(preparedStmt);
        let result = [];
        if(rows.length > 0) {
            result = rows.map(row => this.escapeData(row, ['customer_password', 'customer_deleted_at']));
        }
        return result;
    }
    // get
    async getById(id) {
        const preparedStmt = `select * from ${this.table} where customer_id = :customer_id and customer_deleted_at is null`;
        const [rows] = await connection.execute(preparedStmt, {
            customer_id: id,
        });
        return rows[0];
    }
    // get by username
    async getByUsername(username) {
        const preparedStmt = `select * from ${this.table} where customer_username = :customer_username  and customer_deleted_at is null`;
        const [rows] = await connection.execute(preparedStmt, {
            customer_username: username,
        });
        return rows[0];
    }
    async getNewestUser() {
        const preparedStmt = `select * from ${this.table} where customer_deleted_at is null order by customer_id desc limit 1`;
        const [rows] = await connection.execute(preparedStmt);
        if(rows[0]) {
            return this.escapeData(rows[0], ['customer_password', 'customer_deleted_at']);
        }
        return null;
    }
    // register
    async register(data) {
        const { result: customer, errors } = this.validateCustomerData(data);
        if(errors.length > 0) {
            const errorMessage = errors.map(error => error.msg).join(' ');
            throw new Error(errorMessage);
        }
        const foundCustomer = await this.getByUsername(customer.customer_username);
        if(foundCustomer) {
            throw new Error('Username already exists.');
        }
        const salt = bcrypt.genSaltSync(Number(process.env.SALT_ROUNDS));
        const hashPassword = bcrypt.hashSync(customer.customer_password, salt);
        customer.customer_password = hashPassword;
        const preparedStmt = `insert into ${this.table} (${Object.keys(customer).join(', ')}) values (${Object.keys(customer).map(key => `:${key}`).join(', ')})`;
        await connection.execute(preparedStmt, customer);
        const registeredCustomer = await this.getNewestUser();
        return registeredCustomer;
    }
    // login
    async login(username, password) {
        if(!username || !password) {
            throw Error('Please provide username and password.');
        }
        const customer = await this.getByUsername(username);
        if(!customer) {
            throw Error('Invalid username or password.');
        }
        if(!bcrypt.compareSync(password, customer.customer_password)) {
            throw Error('Invalid username or password.');
        }
        const token = jwt.sign({
            customer_id: customer.customer_id,
            customer_username: customer.customer_username,
            customer_name: customer.customer_name,
            customer_phone_number: customer.customer_phone_number,
            customer_avatar: customer.customer_avatar,
        }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN,
        });
        return {
            customer: {
                id: customer.customer_id,
                username: customer.customer_username,
                name: customer.customer_name,
                phone_number: customer.customer_phone_number,
                avatar: customer.customer_avatar,
            },
            token,
        };
    }
    // update
    async update(id, payload) {
        const data = {
            ...payload,
            customer_id: id,
        }
        const { result: customer, errors } = this.validateCustomerData(data);
        if(errors.length > 0) {
            const errorMessage = errors.map(error => error.msg).join(' ');
            throw new Error(errorMessage);
        }
        const preparedStmt = `update ${this.table} set ${Object.keys(customer).map(key => `${key} = :${key}`).join(', ')} where customer_id = :customer_id`;
        await connection.execute(preparedStmt, {
                ...customer,
                customer_id: id,
            });
    }
    // change password
    async changePassword(id, data) {
        const customer = await this.getById(id);
        if(!customer) {
            throw new Error('Customer not exists.');
        }
        if(!data.customer_password || !data.customer_new_password || !data.customer_confirm_password) {
            throw new Error('Please provide current password, new password and confirm password.');
        }
        if(!bcrypt.compareSync(data.customer_password, customer.customer_password)) {
            throw new Error('Invalid password.');
        }
        const validator = new Validator();
        validator.validateUpdatePassword('customer_password', data.customer_new_password, data.customer_confirm_password);
        if(validator.getErrors().length > 0) {
            const errorMessage = validator.getErrors().map(error => error.msg).join(' ');
            throw new Error(errorMessage);
        }
        const salt = bcrypt.genSaltSync(Number(process.env.SALT_ROUNDS));
        const hashNewPassword = bcrypt.hashSync(data.customer_new_password, salt);
        const preparedStmt = `update ${this.table} set customer_password = :customer_password where customer_id = :customer_id and customer_deleted_at is null`;
        await connection.execute(preparedStmt, {
                customer_password: hashNewPassword,
                customer_id: id,
            });
    }
    // delete
    async delete(id) {
        await connection.execute(`update ${this.table} set customer_deleted_at = :deleted_at where customer_id = :customer_id`, {
            deleted_at: formatDateToString(new Date()),
            customer_id: id,
        });
    }
}

export default CustomerModel;