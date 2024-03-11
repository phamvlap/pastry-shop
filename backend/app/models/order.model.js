import connectDB from './../db/index.js';
import Validator from './../helpers/validator.js';
import {
    CartModel,
    OrderDetailModel,
    AddressModel,
    PaymentMethodModel,
    StatusDetailModel,
} from './index.js';
import { formatDateToString, escapeData, extractData } from './../utils/index.js';

const connection = await connectDB();
connection.config.namedPlaceholders = true;

class OrderModel {
    constructor() {
        this.table = process.env.TABLE_ORDERS;
        this.fields = ['order_date', 'order_total', 'order_note', 'pm_id', 'address_id'];
        this.schema = {
            order_date: {},
            order_total: {
                required: true,
                toInt: true,
            },
            order_note: {
                type: String,
            },
            pm_id: {
                required: true,
                toInt: true,
            },
            address_id: {
                required: true,
                toInt: true,
            },
        };
    }
    validateOrderData(data) {
        const order = extractData(data, this.fields);
        const validator = new Validator();
        return validator.validate(order, this.schema);
    }
    // get all info of an order
    async getInfoOneOrder(order) {
        const orderDetailModel = new OrderDetailModel();
        const addressModel = new AddressModel();
        const paymentMethodModel = new PaymentMethodModel();
        const statusDetailModel = new StatusDetailModel();

        const items = await orderDetailModel.get(order.order_id);
        const receiver = await addressModel.getOneAddress(order.address_id);
        const paymentMethod = await paymentMethodModel.get(order.pm_id);
        const statusList = await statusDetailModel.getAll(order.order_id);
        return {
            ...escapeData(order, ['pm_id', 'address_id']),
            items,
            receiver,
            statusList,
            paymentMethod,
        }
    }
    // get all orders
    async getAll() {
        const query = `select * from ${this.table}`;
        const [rows] = await connection.execute(query);
        const orderList = [];
        if(rows.length > 0) {
            for(const row of rows) {
                const orderDetail = await this.getInfoOneOrder(row);
                orderList.push(orderDetail);
            }
        }
        return orderList;
    }
    // get order by date
    async getByDate(date) {
        const preparedStmt = `select * from ${this.table} where order_date = :order_date`;
        const [rows] = await connection.execute(preparedStmt, {
            order_date: date,
        });
        return (rows.length > 0) ? rows[0] : null;
    }
    // get order by id
    async get(id) {
        const preparedStmt = `select * from ${this.table} where order_id = :order_id`;
        const [rows] = await connection.execute(preparedStmt, {
            order_id: id,
        })
        if(rows.length === 0) {
            throw new Error('Order not found.');
        }
        const orderDetail = await this.getInfoOneOrder(rows[0]);
        return orderDetail;
    }
    // get all orders of an user
    async getUserOrders(customerId) {
        const addressTable = process.env.TABLE_ADDRESSES;
        const preparedStmt = `select * from ${this.table} join ${addressTable} on ${this.table}.address_id = ${addressTable}.address_id where ${addressTable}.customer_id = :customer_id`;
        const [rows] = await connection.execute(preparedStmt, {
            customer_id: customerId,
        });
        const orders = [];
        if(rows.length > 0) {
            for(const row of rows) {
                const order = {
                    ...escapeData(row, ['address_fullname', 'address_phone_number', 'address_detail', 'address_deleted_at', 'customer_id']),
                }
                const orderDetail = await this.getInfoOneOrder(order);
                orders.push(orderDetail);
            }
        }
        return orders;
    }
    // add order
    async add(customerId, payload) {
        const cartModel = new CartModel();
        const orderDetailModel = new OrderDetailModel();
        const statusDetailModel = new StatusDetailModel();

        const currentDate = formatDateToString(new Date());

        const selectedList = await cartModel.getSelectedItems(customerId);
        if(selectedList.length === 0) {
            throw new Error('No product selected.');
        }
        console.log('>>> debug: selectedList', selectedList);
        const total = selectedList.reduce((oldTotal, currItem) => oldTotal + currItem.detail.price.price_value * currItem.quantityInCart, 0);
        const data = {
            ...payload,
            order_total: total,
        };
        const { result: order, errors } = this.validateOrderData(data);
        if(errors.length > 0) {
            throw new Error(errors.map(error => error.msg).join(' '));
        }
        order['order_date'] = currentDate;
        const preparedStmt = `insert into ${this.table} (${Object.keys(order).map(field => field).join(', ')}) values (${Object.keys(order).map(field => `:${field}`).join(', ')})`;
        await connection.execute(preparedStmt, order);

        const justAddedOrder = await this.getByDate(order.order_date);
        if(justAddedOrder) {
            for(const item of selectedList) {
                await orderDetailModel.add(justAddedOrder.order_id, item.detail.product_id, item.quantityInCart);
                await cartModel.delete(customerId, item.detail.product_id);
            }
            const statusDetail = {
                status_id: process.env.STATUS_WAITING_FOR_CONFIRMATION,
                order_id: justAddedOrder.order_id,
                status_updated_at: currentDate,
                status_updated_by: `customer_${customerId}`,
            }
            await statusDetailModel.add(statusDetail);
        }
    }
    // update status of order
    async update(orderId, statusId, implementer = {}) {
        const statusDetailModel = new StatusDetailModel();
        
        let updatedBy = '';
        if(implementer.staff_id) {
            updatedBy = `staff_${implementer.staff_id}`;
        }
        else if(implementer.customer_id) {
            updatedBy = `customer_${implementer.customer_id}`;
        }
        if(updatedBy.length === 0) {
            throw new Error('Someone update status of order must be required.');
        }
        const statusDetail = {
            status_id: statusId,
            order_id: orderId,
            status_updated_at: formatDateToString(new Date()),
            status_updated_by: updatedBy,
        }
        await statusDetailModel.add(statusDetail);
    }
    // cancel order
    async destroy(orderId, implementer = {}) {
        await this.update(orderId, process.env.STATUS_CANCELLED, implementer);
    }
}

export default OrderModel;