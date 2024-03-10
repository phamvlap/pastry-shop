import connectDB from './../db/index.js';
import Validator from './../helpers/validator.js';
import { StaffModel, CustomerModel, StatusModel} from './index.js';
import { formatDateToString, extractData } from './../utils/index.js';

const connection = await connectDB();
connection.config.namedPlaceholders = true;

class StatusDetailModel {
    constructor() {
        this.table = process.env.TABLE_STATUS_DETAILS;
        this.fields = ['status_id', 'order_id', 'status_updated_at', 'status_updated_by'];
        this.schema = {
            status_id: {
                required: true,
                toInt: true,
            },
            order_id: {
                required: true,
                toInt: true,
            },
            status_updated_at: {},
            status_updated_by: {
                type: String, // STAFF_<ID> | CUSTOMER_<ID>
                required: true,
            },
        };
    }
    validateOrderData(data) {
        const product = extractData(data, this.fields);
        const validator = new Validator();
        return validator.validate(product, this.schema);
    }
    // get all detail {updatedAt, status, implementer} of one status
    async getOneStatusDetail(statusDetail) {
        const statusModel = new StatusModel();
        const staffModel = new StaffModel();
        const customerModel = new CustomerModel();

        const status = await statusModel.get(statusDetail.status_id);
        let implementer = {};
        if(statusDetail.status_updated_by.toLowerCase().startsWith('staff_')) {
            implementer = await staffModel.getById(statusDetail.status_updated_by.split('_')[1]);
        }
        else if(statusDetail.status_updated_by.toLowerCase().startsWith('customer_')) {
            implementer = await customerModel.getById(statusDetail.status_updated_by.split('_')[1]);
        }
        return {
            updatedAt: statusDetail.status_updated_at,
            status,
            implementer: {
                role: statusDetail.status_updated_by.toLowerCase().split('_')[0],
                ...implementer,
            }
        }
    }
    // get all status of an order
    async getAll(orderId) {
        const preparedStmt = `select * from ${this.table} where order_id = :order_id`;
        const [rows] = await connection.execute(preparedStmt, {
            order_id: orderId,
        });

        let statusList = [];
        if(rows.length > 0) {
            for(const row of rows) {
                const infoStatus = await this.getOneStatusDetail(row);
                statusList.push(infoStatus);
            }
        }
        return statusList;
    }
    // get the latest status of an order
    async getLatestStatus(orderId) {
        const preparedStmt = `select * from ${this.table} where order_id = :order_id order by status_updated_at desc limit 1`;
        const [rows] = await connection.execute(preparedStmt, {
            order_id: orderId,
        });

        let status = {};
        if(rows.length > 0) {
            status = await this.getOneStatusDetail(rows[0]);
        }
        return status;
    }
    async add(payload) {
        const { result: statusDetail, errors } = this.validateOrderData(payload);
        if(errors.length > 0) {
            throw new Error(errors.map(error => error.msg).join(' '));
        }
        if(!(statusDetail.status_updated_by.toLowerCase().startsWith('staff_') || statusDetail.status_updated_by.toLowerCase().startsWith('customer_'))) {
            throw new Error('Format of status_updated_by: STAFF_<ID> | CUSTOMER_<ID>');
        }
        statusDetail['status_updated_at'] = formatDateToString();        
        const preparedStmt = `insert into ${this.table} (${this.fields.join(', ')}) values (${this.fields.map(field => `:${field}`).join(', ')})`;
        await connection.execute(preparedStmt, statusDetail);
    }
}

export default StatusDetailModel;