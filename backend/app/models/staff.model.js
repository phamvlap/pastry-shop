import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import connectDB from './../db/index.js';
import Validator from './validator.js';

const connection = await connectDB();
connection.config.namedPlaceholders = true;

class StaffModel {
    constructor() {
        this.table = process.env.TABLE_STAFFS;
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
    extractStaffData(payload) {
        const staff = {
            staff_email: payload.staff_email,
            staff_password: payload.staff_password,
            staff_name: payload.staff_name,
            staff_role: payload.staff_role,
            staff_phone_number: payload.staff_phone_number,
            staff_address: payload.staff_address,
        };
        Object.keys(staff).forEach(key => {
            if(staff[key] === undefined) {
                delete staff[key];
            }
        });
        return staff;
    }
    validateStaffData(data) {
        const staff = this.extractStaffData(data);
        const validator = new Validator();
        return validator.validate(staff, this.schema);
    }
    // get all
    async getAll() {
        const preparedStmt = `select * from ${this.table}`;
        const [rows] = await connection.execute(preparedStmt);
        return rows;
    }
    // get
    async getById(id) {
        const preparedStmt = `select * from ${this.table} where staff_id = :staff_id`;
        const [row] = await connection.execute(preparedStmt, {
            staff_id: id,
        });
        return row;
    }
    async login(email, password) {
        const preparedStmt = `select * from ${this.table} where staff_email = :staff_email`;
        const [rows] = await connection.execute(preparedStmt, {
            staff_email: email,
        });
        if(rows.length === 0) {
            throw Error('Invalid email or password');
        }
        const staff = rows[0];
        if(!bcrypt.compareSync(password, staff.staff_password)) {
            throw Error('Invalid email or password');
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
    // update
    async update(id, data) {
        const { result: staff, errors } = this.validateStaffData(data);
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
        const { result: staff, errors } = this.validateStaffData(data);
        if(errors.length > 0) {
            const errorMessage = errors.map(error => error.msg).join(' ');
            throw new Error(errorMessage);
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
        const preparedStmt = `delete from ${this.table} where staff_id = :staff_id`;
        await connection.execute(preparedStmt, {
            staff_id: id,
        });
    }
}

export default StaffModel;