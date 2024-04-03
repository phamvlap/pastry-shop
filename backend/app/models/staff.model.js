import connectDB from './../db/index.js';
import Validator from './../helpers/validator.js';
import { formatDateToString, escapeData, extractData } from './../utils/index.js';
import { AccountModel } from './../models/index.js';

const connection = await connectDB();
connection.config.namedPlaceholders = true;

class StaffModel {
    constructor() {
        this.table = process.env.TABLE_STAFFS;
        this.fields = ['staff_email', 'staff_name', 'staff_role', 'staff_phone_number', 'staff_address'];
        this.schema = {
            staff_email: {
                type: String,
                required: true,
                email: true,
            },
            staff_name: {
                type: String,
                required: true,
                min: 3,
            },
            staff_role: {
                type: String, // admin, staff
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
        return { result, errors };   
    }
    // get all
    async getAll(staff_name, staff_address, staff_role, staffNameOrder, limit, offset) {
        const parseStaffName = staff_name ? staff_name.trim() : null;
        const parseStaffAddress = staff_address ? staff_address.trim() : null;
        const parseStaffRole = staff_role ? staff_role.trim() : null;
        const parseStaffNameOrder = staffNameOrder ? staffNameOrder.trim() : 'asc';
        const parseLimit = limit ? ('' + limit) : ('' + process.env.MAX_LIMIT);
        const parseOffset = offset ? ('' + offset) : '0';
        
        let preparedStmt = `
            select *
            from ${this.table}
            where (:staff_name is null or staff_name like :staff_name)
                and (:staff_address is null or staff_address like :staff_address)
                and (:staff_role is null or staff_role = :staff_role)
            order by staff_name ${parseStaffNameOrder}
            limit :limit offset :offset;
        `;

        const [rows] = await connection.execute(preparedStmt, {
            staff_name: `%${parseStaffName}%`,
            staff_address: `%${parseStaffAddress}%`,
            staff_role: parseStaffRole,
            limit: parseLimit,
            offset: parseOffset,
        });
        return (rows.length > 0) ? rows : [];
    }
    // get by id
    async getById(id) {
        const preparedStmt = `
            select *
            from ${this.table}
            where staff_id = :staff_id;
        `;
        const [rows] = await connection.execute(preparedStmt, {
            staff_id: id,
        });
        return (rows.length > 0) ? rows[0] : null;
    }
    // get all properties of staff by email
    async getByEmail(email) {
        const preparedStmt = `
            select *
            from ${this.table}
            where staff_email = :staff_email;
        `;
        const [rows] = await connection.execute(preparedStmt, {
            staff_email: email,
        });
        return (rows.length > 0) ? rows[0] : null;
    }
    // store staff data
    async store(data) {
        const { result: staff, errors } = this.validateStaffData(data);
        if(errors.length > 0) {
            const errorMessage = errors.map(error => error.msg).join(' ');
            throw new Error(errorMessage);
        }

        const accountModel = new AccountModel();
        const payload = {
            account_email: staff.staff_email,
            account_password: data.staff_password,
            account_role: 'staff',
        };
        console.log(staff);
        console.log(payload);
        const account = await accountModel.add(payload);

        staff.account_id = account.account_id;

        const preparedStmt = `
            insert into ${this.table} (${Object.keys(staff).join(', ')})
                values (${Object.keys(staff).map(key => `:${key}`).join(', ')})
        `;
        await connection.execute(preparedStmt, staff);
    }

    // update
    async update(id, payload) {
        const oldStaff = await this.getById(id);
        if(!oldStaff) {
            throw new Error('Staff not exists.');
        }
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
        const preparedStmt = `
            update ${this.table}
            set ${Object.keys(staff).map(key => `${key} = :${key}`).join(', ')}
            where staff_id = :staff_id;
        `;
        await connection.execute(preparedStmt, {
                ...staff,
                staff_id: id,
            });
    }
    // delete
    async delete(id) {
        const oldStaff = await this.getById(id);
        if(!oldStaff) {
            throw new Error('Staff not exists.');
        }
        const acocuntModel = new AccountModel();
        await acocuntModel.delete(oldStaff.account_id);
    }
}

export default StaffModel;