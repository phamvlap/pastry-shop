import connectDB from './../db/index.js';
import Validator from './../helpers/validator.js';
import { ProductModel } from './index.js';
import { escapeData } from './../utils/index.js';

const connection = await connectDB();
connection.config.namedPlaceholders = true;

class OrderDetailModel {
    constructor() {
        this.table = process.env.TABLE_ORDER_DETAILS;
        this.fields = ['order_id', 'product_id', 'product_quantity'];
        this.schema = {
            order_id: {
                required: true,
                toInt: true,
            },
            product_id: {
                required: true,
                toInt: true,
            },
            product_quantity: {
                required: true,
                toInt: true,
            },
        };
    }
    // get all products in order
    async get(orderId) {
        const preparedStmt = `select * from ${this.table} where order_id = :order_id`;
        const [rows] = await connection.execute(preparedStmt, {
            order_id: orderId,
        });
        const productModel = new ProductModel();
        let items = [];
        if(rows.length > 0) {
            for(const row of rows) {
                const item = await productModel.get(row.product_id);
                items.push({
                    ...escapeData(row, ['product_id']),
                    detail: item,
                });
            }
        }
        return items;
    }
    // add product to order
    async add(orderId = '', productId = '', productQuantity = '') {
        const validator = new Validator();
        const { result: orderDetail, errors } = validator.validate({
            order_id: orderId,
            product_id: productId,
            product_quantity: productQuantity,
        }, this.schema);
        if(errors.length > 0) {
            throw new Error(errors.map(error => error.msg).join(' '));
        }
        const preparedStmt = `insert into ${this.table} (${this.fields.join(', ')}) values (${this.fields.map(field => `:${field}`).join(', ')})`;
        await connection.execute(preparedStmt, orderDetail);
    }
}

export default OrderDetailModel;