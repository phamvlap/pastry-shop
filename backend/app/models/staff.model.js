import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import connectDB from './../db/index.js';
import Validator from './validator.js';

import formatDateToString from './../utils/formatDateToString.util.js';
import escapeData from './../utils/escapeData.util.js';
import extractData from './../utils/extractData.util.js';

const connection = await connectDB();
connection.config.namedPlaceholders = true;

class StaffModel {
    constructor() {
        this.table = process.env.TABLE_STAFFS;
        this.fields = ['staff_email', 'staff_password', 'staff_name', 'staff_role', 'staff_phone_number', 'staff_address'];
        this.schema = {
            staff_email: {
                type: String,
                required: true,
                email: true,
            },
            staff_password: {
                type: String,
                required: true,
                password: true,
            },
            staff_name: {
                type: String,
                required: true,
                min: 3,
            },
            staff_role: {
                type: String, // admin, salesperson, secretary
                required: true,
            },
            staff_phone_number: {
                type: String,
                required: true,
                phoneNumber: true,
            },
            staff_address: {
                type: String,
                required: true,
                min: 5,
            },
        };
    }
    validateStaffData(data, exceptions = []) {
        const staff = extractData(data, this.fields);
        const validator = new Validator();
        let schema = {};
        Object.keys(this.schema).map(key => {
            if(!exceptions.includes(key)) {
                schema[key] = this.schema[key];
            }
        });
        let { result, errors } = validator.validate(staff, schema); 
        if(!data.staff_id) {
            result['staff_deleted_at'] = null;
        }
        return { result, errors };   
    }
    // get all
    async getAll() {
        const preparedStmt = `select * from ${this.table} where staff_deleted_at is null`;
        const [rows] = await connection.execute(preparedStmt);
        return (rows.length > 0) ? rows.map(row => escapeData(row, ['staff_password', 'staff_deleted_at'])) : [];
    }
    // get all by id
    async getAllById(id) {
        const preparedStmt = `select * from ${this.table} where staff_id = :staff_id and staff_deleted_at is null`;
        const [rows] = await connection.execute(preparedStmt, {
            staff_id: id,
        });
        return (rows.length > 0) ? rows[0] : null;
    }
    async getAllByEmail(email) {
        const preparedStmt = `select * from ${this.table} where staff_email = :staff_email and staff_deleted_at is null`;
        const [rows] = await connection.execute(preparedStmt, {
            staff_email: email,
        });
        return (rows.length > 0) ? rows[0] : null;
    }
    async getById(id) {
        const data = await this.getAllById(id);
        return (data) ? escapeData(data, ['staff_password', 'staff_deleted_at']) : null;
    }
    // create
    async store(data) {
        const { result: staff, errors } = this.validateStaffData(data);
        if(errors.length > 0) {
            const errorMessage = errors.map(error => error.msg).join(' ');
            throw new Error(errorMessage);
        }
        const salt = bcrypt.genSaltSync(Number(process.env.SALT_ROUNDS));
        const hashPassword = bcrypt.hashSync(staff.staff_password, salt);
        staff.staff_password = hashPassword;
        const preparedStmt = `insert into ${this.table} (${Object.keys(staff).join(', ')}) values (${Object.keys(staff).map(key => `:${key}`).join(', ')})`;
        await connection.execute(preparedStmt, staff);
    }
    async login(email, password) {
        if(!email || !password) {
            throw Error('Please provide email and password.');
        }
        const staff = this.getAllByEmail(email);
        if(!staff) {
            throw Error('Invalid email or password.');
        }
        if(!bcrypt.compareSync(password, staff.staff_password)) {
            throw Error('Invalid email or password.');
        }
        const token = jwt.sign({
            staff_id: staff.staff_id,
            staff_name: staff.staff_name,
            staff_email: staff.staff_email,
            staff_role: staff.staff_role,
            staff_phone_number: staff.staff_phone_number,
        }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN,
        });
        return {
            staff: {
                id: staff.staff_id,
                name: staff.staff_name,
                email: staff.staff_email,
                role: staff.staff_role,
                phone_number: staff.staff_phone_number,
            },
            token,
        };
    }
    // update
    async update(id, payload) {
        let exceptions= [];
        Object.keys(this.schema).forEach(key => {
            if(!payload.hasOwnProperty(key)) {
                exceptions.push(key);
            }
        });
        const data = {
            ...payload,
            staff_id: id,
        }
        const { result: staff, errors } = this.validateStaffData(data, exceptions);
        if(errors.length > 0) {
            const errorMessage = errors.map(error => error.msg).join(' ');
            throw new Error(errorMessage);
        }
        const preparedStmt = `update ${this.table} set ${Object.keys(staff).map(key => `${key} = :${key}`).join(', ')} where staff_id = :staff_id`;
        await connection.execute(preparedStmt, {
                ...staff,
                staff_id: id,
            });
    }
    // change password
    async changePassword(id, data) {
        const staff = await this.getAllById(id);
        if(!staff) {
            throw new Error('Staff not exists.');
        }
        if(!data.staff_password || !data.staff_new_password || !data.staff_confirm_password) {
            throw new Error('Please provide current password, new password and confirm password.');
        }
        data.staff_password = data.staff_password.trim();
        data.staff_new_password = data.staff_new_password.trim();
        data.staff_confirm_password = data.staff_confirm_password.trim();
        if(!bcrypt.compareSync(data.staff_password, staff.staff_password)) {
            throw new Error('Invalid password.');
        }
        const validator = new Validator();
        validator.validateUpdatePassword('staff_password', data.staff_new_password, data.staff_confirm_password);
        if(validator.getErrors().length > 0) {
            const errorMessage = validator.getErrors().map(error => error.msg).join(' ');
            throw new Error(errorMessage);
        }
        const salt = bcrypt.genSaltSync(Number(process.env.SALT_ROUNDS));
        const hashNewPassword = bcrypt.hashSync(data.staff_new_password, salt);
        const preparedStmt = `update ${this.table} set staff_password = :staff_password where staff_id = :staff_id`;
        await connection.execute(preparedStmt, {
                staff_password: hashNewPassword,
                staff_id: id,
            });
    }
    // delete
    async delete(id) {
        const preparedStmt = `update ${this.table} set staff_deleted_at = :deleted_at where staff_id = :staff_id`;
        await connection.execute(preparedStmt, {
            deleted_at: formatDateToString(),
            staff_id: id,
        });
    }
}

export default StaffModel;