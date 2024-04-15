import { unlink } from 'fs/promises';
import fs from 'fs';

import connectDB from './../db/index.js';
import Validator from './../helpers/validator.js';
import { formatDateToString, escapeData, extractData } from './../utils/index.js';
import { AccountModel, ImageModel } from './../models/index.js';

const connection = await connectDB();
connection.config.namedPlaceholders = true;

class CustomerModel {
    constructor() {
        this.table = process.env.TABLE_CUSTOMERS;
        this.fields = ['customer_username', 'customer_name', 'customer_phone_number'];
        this.schema = {
            customer_username: {
                type: String,
                required: true,
                min: 3,
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
        };
    }
    validateCustomerData(data, exceptions = []) {
        const customer = extractData(data, this.fields);
        const schema = {};
        Object.keys(this.schema).map((key) => {
            if (!exceptions.includes(key)) {
                schema[key] = this.schema[key];
            }
        });
        const validator = new Validator();
        let { result, errors } = validator.validate(customer, schema);
        return { result, errors };
    }
    // get avatar for customer
    async getAvatar(id) {
        const imageModel = new ImageModel();
        const images = await imageModel.getAll('customer', id);
        return images.length > 0 ? images[0] : null;
    }
    // get all
    async getAll() {
        const preparedStmt = `select * from ${this.table}`;
        const [rows] = await connection.execute(preparedStmt);
        return rows.length > 0 ? rows : [];
    }
    // get newest user
    async getNewestUser() {
        const preparedStmt = `
            select * 
            from ${this.table} 
            order by customer_id desc 
            limit 1
        `;
        const [rows] = await connection.execute(preparedStmt);
        return rows[0] ? rows[0] : null;
    }
    // get all infos by id
    async getById(id) {
        const preparedStmt = `
            select *
            from ${this.table}
            where customer_id = :customer_id
        `;
        const [rows] = await connection.execute(preparedStmt, {
            customer_id: id,
        });
        const avatar = await this.getAvatar(id);
        return rows.length > 0
            ? {
                  ...rows[0],
                  customer_avatar: avatar,
              }
            : null;
    }
    // get all infos by username
    async getByUsername(username) {
        const preparedStmt = `
            select * 
            from ${this.table}
            where customer_username = :customer_username;
        `;
        const [rows] = await connection.execute(preparedStmt, {
            customer_username: username,
        });
        let avatar = '';
        if (rows.length > 0) {
            avatar = await this.getAvatar(rows[0].customer_id);
        }
        return rows.length > 0
            ? {
                  ...rows[0],
                  customer_avatar: avatar,
              }
            : null;
    }
    // register
    async register(payload) {
        const { result: customer, errors } = this.validateCustomerData(payload);
        if (errors.length > 0) {
            const errorMessage = errors.map((error) => error.msg).join(' ');
            throw new Error(errorMessage);
        }

        const accountModel = new AccountModel();
        const payloadAccount = {
            account_username: customer.customer_username,
            account_password: payload.customer_password,
            account_role: 'customer',
        };
        const account = await accountModel.add(payloadAccount);

        customer.account_id = account.account_id;

        const preparedStmt = `
            insert into ${this.table} (${Object.keys(customer).join(', ')})
                values (${Object.keys(customer)
                    .map((key) => `:${key}`)
                    .join(', ')})
        `;

        await connection.execute(preparedStmt, customer);
        const registeredCustomer = await this.getNewestUser();

        const imageModel = new ImageModel();
        const avatar = {
            image_url: process.env.DEFAULT_URL_AVATAR_USER,
            image_target: 'customer',
            belong_id: registeredCustomer.customer_id,
        };
        await imageModel.store(avatar);

        return registeredCustomer;
    }
    // update
    async update(id, payload) {
        const imageModel = new ImageModel();
        const accountModel = new AccountModel();

        const oldCustomer = await this.getById(id);
        if (!oldCustomer) {
            throw new Error('Customer not exists.');
        }
        let exceptions = [];
        payload = Object.assign({}, payload);
        Object.keys(this.schema).forEach((key) => {
            if (!payload.hasOwnProperty(key)) {
                exceptions.push(key);
            }
        });
        const { result: customer, errors } = this.validateCustomerData(
            {
                customer_id: id,
                ...payload,
            },
            exceptions,
        );
        if (errors.length > 0) {
            const errorMessage = errors.map((error) => error.msg).join(' ');
            throw new Error(errorMessage);
        }
        // update info customer
        if (Object.keys(customer).length > 0) {
            const preparedStmt = `
                update ${this.table}
                set ${Object.keys(customer)
                    .map((key) => `${key} = :${key}`)
                    .join(', ')}
                where customer_id = :customer_id;
            `;
            await connection.execute(preparedStmt, {
                ...customer,
                customer_id: id,
            });
            if (customer.customer_username) {
                await accountModel.update(oldCustomer.account_id, {
                    account_username: customer.customer_username,
                });
            }
        }
        // update avatar
        const newAvatar = payload.customer_avatar ? payload.customer_avatar[0] : null;
        const oldAvatar = await this.getAvatar(id);
        if (newAvatar && oldAvatar.image_url !== process.env.DEFAULT_URL_AVATAR_USER) {
            if (fs.existsSync(oldAvatar.image_url)) {
                try {
                    unlink(oldAvatar.image_url);
                } catch (error) {
                    throw new Error('Failed to remove old avatar.');
                }
            }
        }
        if (newAvatar) {
            const image = {
                image_url: newAvatar.path,
                image_target: 'customer',
                belong_id: id,
            };
            await imageModel.update(oldAvatar.image_id, image);
        }
    }
    // delete
    async delete(id) {
        const oldCustomer = await this.getById(id);
        if (!oldCustomer) {
            throw new Error('Customer not exists.');
        }
        const acocuntModel = new AccountModel();
        await acocuntModel.delete(oldCustomer.account_id);
    }
}

export default CustomerModel;
