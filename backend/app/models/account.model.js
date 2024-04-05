import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import connectDB from './../db/index.js';
import Validator from './../helpers/validator.js';
import { formatDateToString, escapeData, extractData } from './../utils/index.js';
import { StaffModel, CustomerModel } from './../models/index.js';

const connection = await connectDB();
connection.config.namedPlaceholders = true;

class AccountModel {
	constructor() {
		this.table = process.env.TABLE_ACCOUNTS;
		this.fields = ['account_email', 'account_username', 'account_password', 'account_role'];
		this.schema = {
            account_email: {
                type: String,
                required: true,
                email: true,
            },
            account_username: {
                type: String,
                required: true,
                min: 2,
            },
            account_password: {
                type: String,
                required: true,
                password: true,
            },
            account_role: {
                type: String,
                required: true,
            },
		}
	}
	validateAccountData(data, exceptions = []) {
        const account = extractData(data, this.fields);
        const schema = {};
        Object.keys(this.schema).map(key => {
            if(!exceptions.includes(key)) {
                schema[key] = this.schema[key];
            }
        });
        if(account.account_role === 'staff') {
        	delete schema.account_username;
        }
        else if(account.account_role === 'customer') {
        	delete schema.account_email;
        }
        const validator = new Validator();
        let { result, errors } = validator.validate(account, schema);
        if(!data.account_id) {
    		result['account_deleted_at'] = `${process.env.TIME_NOT_DELETED}`;
        }
        return { result, errors };
    }
    async getById(id) {
    	const preparedStmt = `select * from ${this.table} where account_id = :id`;
		const [rows] = await connection.execute(preparedStmt, {
			id,
		});
		return (rows.length > 0) ? rows[0] : null;
    }
    async getByEmail(email) {
    	const preparedStmt = `select * from ${this.table} where account_email = :email`;
    	const [rows] = await connection.execute(preparedStmt, {
    		email,
    	});
    	return (rows.length > 0) ? rows[0] : null;
    }
    async getByUsername(username) {
		const preparedStmt = `select * from ${this.table} where account_username = :username`;
		const [rows] = await connection.execute(preparedStmt, {
			username,
		});
		return (rows.length > 0) ? rows[0] : null;
	}
	async getNewestAccount() {
		const preparedStmt = `select * from ${this.table} order by account_id desc limit 1`;
		const [rows] = await connection.execute(preparedStmt);
		return (rows.length > 0) ? rows[0] : null;
	}
	async add(payload) {
		const { result: account, errors } = this.validateAccountData(payload);
        if(errors.length > 0) {
            const errorMessage = errors.map(error => error.msg).join(' ');
            throw new Error(errorMessage);
        }

        let oldAccount = '';
        if(account.account_role === 'staff') {
        	oldAccount = await this.getByEmail(account.account_email);
        }
        else if(account.account_role === 'customer') {
        	oldAccount = await this.getByUsername(account.account_username);
        }

        if(oldAccount) {
            throw new Error('Account already exists.');
        }

        const salt = bcrypt.genSaltSync(Number(process.env.SALT_ROUNDS));
        const hashPassword = bcrypt.hashSync(account.account_password, salt);

        account.account_password = hashPassword;

        const preparedStmt = `
        	insert into ${this.table} (${Object.keys(account).map(key => `${key}`).join(', ')})
        		values (${Object.keys(account).map(key => `:${key}`).join(', ')});
        `;
        await connection.execute(preparedStmt, account);

        const registeredAccount = await this.getNewestAccount();
        return {
        	account_id: registeredAccount.account_id,
			account_email: registeredAccount.account_email,
			account_username: registeredAccount.account_username,
			account_role: registeredAccount.account_role,
        };
	}
	async login(payload) {
		if(Object.keys(payload).length === 0) {
            throw new Error('Please provide enough information to login.');
        }
        let account = '';
        if(payload.account_role === 'staff') {
            if(!payload.account_email) {
                throw new Error('Please provide email.');
            }
        	account = await this.getByEmail(payload.account_email);
        }
        else if(payload.account_role === 'customer') {
            if(!payload.account_username) {
                throw new Error('Please provide username.');
            }
        	account = await this.getByUsername(payload.account_username);
        }

        if(!account) {
        	throw new Error('Invalid information.');
        }

        if(!bcrypt.compareSync(payload.account_password, account.account_password)) {
            throw new Error('Invalid information.');
        }

        let data = '';
        if(account.account_role === 'staff') {
			const staffModel = new StaffModel();
			data = await staffModel.getByEmail(payload.account_email);
		}
		else if(account.account_role === 'customer') {
			const customerModel = new CustomerModel();
			data = await customerModel.getByUsername(payload.account_username);
		}
        const token = jwt.sign(data, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN,
        });
        return {
        	accounntId: account.account_id,
            accountRole: account.account_role,
            data,
            expiresIn: 24 * 60 * 60,
            token,
        };
	}
	async changePassword(id, data) {
		const account = await this.getById(id);
        if(!data.cur_password || !data.new_password || !data.confirm_password) {
            throw new Error('Please provide current password, new password and confirm password.');
        }
        data.cur_password = data.cur_password.trim();
        data.new_password = data.new_password.trim();
        data.confirm_password = data.confirm_password.trim();
        if(!bcrypt.compareSync(data.cur_password, account.account_password)) {
            throw new Error('Invalid password.');
        }
        const validator = new Validator();
        validator.validateUpdatePassword('account_password', data.new_password, data.confirm_password);
        if(validator.getErrors().length > 0) {
            const errorMessage = validator.getErrors().map(error => error.msg).join(' ');
            throw new Error(errorMessage);
        }
        const salt = bcrypt.genSaltSync(Number(process.env.SALT_ROUNDS));
        const hashNewPassword = bcrypt.hashSync(data.new_password, salt);
        const preparedStmt = `
        	update ${this.table}
        	set account_password = :account_password
        	where account_id = :account_id
        		and account_deleted_at = '${process.env.TIME_NOT_DELETED}'
        `;
        await connection.execute(preparedStmt, {
                account_password: hashNewPassword,
                account_id: id,
            });
	}
	async delete(id) {
		const preparedStmt = `
			update ${this.table}
			set account_deleted_at = :deleted_at
			where account_id = :account_id
				and account_deleted_at = '${process.env.TIME_NOT_DELETED}';
		`;
		await connection.execute(preparedStmt, {
			deleted_at: formatDateToString(new Date()),
			account_id: id,
		});
	}
}

export default AccountModel;