import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import connectDB from './../db/index.js';
import Validator from './../helpers/validator.js';
import { formatDateToString, escapeData, extractData } from './../utils/index.js';

const connection = await connectDB();
connection.config.namedPlaceholders = true;

class CustomerModel {
    constructor() {
        this.table = process.env.TABLE_CUSTOMERS;
        this.fields = ['customer_username', 'customer_password', 'customer_name', 'customer_phone_number', 'customer_avatar'];
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
            },
        };
    }
    validateCustomerData(data, exceptions = []) {
        const customer = extractData(data, this.fields);
        const schema = {};
        Object.keys(this.schema).map(key => {
            if(!exceptions.includes(key)) {
                schema[key] = this.schema[key];
            }
        });
        const validator = new Validator();
        if(customer.customer_avatar) {
            customer.customer_avatar = validator.convertToImagesString('customer_avatar', customer.customer_avatar);
        }
        let { result, errors } = validator.validate(customer, schema);
        if(!data.customer_id) {
            result['customer_deleted_at'] = null;
        }
        return { result, errors };
    }
    // get all
    async getAll() {
        const preparedStmt = `select * from ${this.table} where customer_deleted_at is null`;
        const [rows] = await connection.execute(preparedStmt);
        return (rows.length > 0) ? rows.map(row => escapeData(row, ['customer_password', 'customer_deleted_at'])) : [];
    }
    // get by Id
    async getById(id) {
        const preparedStmt = `select * from ${this.table} where customer_id = :customer_id and customer_deleted_at is null`;
        const [rows] = await connection.execute(preparedStmt, {
            customer_id: id,
        });
        return (rows[0]) ? escapeData(rows[0], ['customer_password', 'customer_deleted_at']) : null;
    }
    // get newest user
    async getNewestUser() {
        const preparedStmt = `select * from ${this.table} where customer_deleted_at is null order by customer_id desc limit 1`;
        const [rows] = await connection.execute(preparedStmt);
        return (rows[0]) ? escapeData(rows[0], ['customer_password', 'customer_deleted_at']) : null;
    }
    // get all infos by Id
    async getAllById(id) {
        const preparedStmt = `select * from ${this.table} where customer_id = :customer_id and customer_deleted_at is null`;
        const [rows] = await connection.execute(preparedStmt, {
            customer_id: id,
        });
        return (rows.length > 0) ? rows[0] : null;
    }
    // get all infos by username
    async getAllByUsername(username) {
        const preparedStmt = `select * from ${this.table} where customer_username = :customer_username and customer_deleted_at is null`;
        const [rows] = await connection.execute(preparedStmt, {
            customer_username: username,
        });
        return (rows.length > 0) ? rows[0] : null;
    }
    // register
    async register(data) {
        const { result: customer, errors } = this.validateCustomerData(data);
        if(errors.length > 0) {
            const errorMessage = errors.map(error => error.msg).join(' ');
            throw new Error(errorMessage);
        }
        const oldCustomer = await this.getAllByUsername(customer.customer_username);
        if(oldCustomer) {
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
            throw Error('Please provide both username and password.');
        }
        const customer = await this.getAllByUsername(username);
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
        let exceptions= [];
        payload = Object.assign({}, payload);
        Object.keys(this.schema).forEach(key => {
            if(!payload.hasOwnProperty(key)) {
                exceptions.push(key);
            }
        });
        const data = {
            ...payload,
            customer_id: id,
        }
        const { result: customer, errors } = this.validateCustomerData(data, exceptions);
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
        const customer = await this.getAllById(id);
        if(!data.customer_password || !data.customer_new_password || !data.customer_confirm_password) {
            throw new Error('Please provide current password, new password and confirm password.');
        }
        data.customer_password = data.customer_password.trim();
        data.customer_new_password = data.customer_new_password.trim();
        data.customer_confirm_password = data.customer_confirm_password.trim();
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