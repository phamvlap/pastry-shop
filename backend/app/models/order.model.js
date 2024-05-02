import connectDB from './../db/index.js';
import Validator from './../helpers/validator.js';
import {
    CartModel,
    OrderDetailModel,
    AddressModel,
    PaymentMethodModel,
    StatusDetailModel,
    ProductModel,
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
        };
    }
    // get all orders
    async getAll(filter = {}) {
        const statusId = Number(filter.status_id) || null;
        const startDate = (filter.start_date && filter.start_date !== 'null') ? filter.start_date : null;
        const endDate = (filter.end_date && filter.end_date !== 'null') ? filter.end_date : null;
        const orderTotalOrder = ['asc', 'desc'].includes(filter.order_total) ? filter.order_total : null;
        const limit = (filter.limit && filter.limit !== 'null') ? '' + filter.limit : '' + process.env.MAX_LIMIT;
        const offset = (filter.offset && filter.offset !== 'null') ? '' + filter.offset : '0';

        let preparedStmt = `
            select *
            from ${this.table}
            where (:status_id is null or order_id in (
                    select order_id
                    from (
                        select order_id, max(status_id) as current_status
                        from ${process.env.TABLE_STATUS_DETAILS}
                        group by order_id
                    ) as tmp
                    where tmp.current_status = :status_id
                ))
            and (:start_date is null or order_date >= :start_date)
            and (:end_date is null or order_date <= :end_date)
        `;
        if (orderTotalOrder) {
            preparedStmt += ` order by order_total ${orderTotalOrder}`;
        }
        preparedStmt += ` limit :limit offset :offset`;
        const [rows] = await connection.execute(preparedStmt, {
            status_id: statusId,
            start_date: startDate,
            end_date: endDate,
            limit,
            offset,
        });
        const orderList = [];
        if (rows.length > 0) {
            for (const row of rows) {
                const orderDetail = await this.getInfoOneOrder(row);
                orderList.push(orderDetail);
            }
        }
        const count = await this.getCount(filter);
        return {
            count,
            orders: orderList,
        };
    }
    // get count of orders
    async getCount(filter = {}) {
        const statusId = Number(filter.status_id) || null;
        const startDate = filter.start_date !== 'null' ? filter.start_date : null;
        const endDate = filter.end_date !== 'null' ? filter.end_date : null;

        const preparedStmt = `
            select count(*) as total
            from ${this.table}
            where (:status_id is null or order_id in (
                    select order_id
                    from ${process.env.TABLE_STATUS_DETAILS}
                    where status_id = :status_id
                ))
            and (:start_date is null or order_date >= :start_date)
            and (:end_date is null or order_date <= :end_date)
        `;
        const [rows] = await connection.execute(preparedStmt, {
            status_id: statusId,
            start_date: startDate,
            end_date: endDate,
        });
        return rows[0].total;
    }
    // get order by date
    async getByDate(date) {
        const preparedStmt = `
            select * 
            from ${this.table} 
            where order_date = :order_date
        `;
        const [rows] = await connection.execute(preparedStmt, {
            order_date: date,
        });
        return rows.length > 0 ? rows[0] : null;
    }
    // get order by id
    async get(id) {
        const preparedStmt = `
            select * 
            from ${this.table} 
            where order_id = :order_id
        `;
        const [rows] = await connection.execute(preparedStmt, {
            order_id: id,
        });
        if (rows.length === 0) {
            throw new Error('Order not found.');
        }
        const orderDetail = await this.getInfoOneOrder(rows[0]);
        return orderDetail;
    }
    // get all orders of an user
    async getUserOrders(customerId, orderStatusId) {
        orderStatusId = Number(orderStatusId);
        if (isNaN(orderStatusId)) {
            orderStatusId = null;
        }
        const addressTable = process.env.TABLE_ADDRESSES;
        const statusDetailsTable = process.env.TABLE_STATUS_DETAILS;

        let rows = [];
        if(!orderStatusId) {
            let preparedStmt = `
                select *
                from ${this.table} join ${addressTable}
                    on ${this.table}.address_id = ${addressTable}.address_id
                where ${addressTable}.customer_id = :customer_id
            `;
            [rows] = await connection.execute(preparedStmt, {
                customer_id: customerId,
                order_status_id: orderStatusId,
            });
        }
        else {
            let preparedStmt = `
                select *
                from ${this.table} join ${addressTable}
                    on ${this.table}.address_id = ${addressTable}.address_id
                where ${addressTable}.customer_id = :customer_id
                    and ${this.table}.order_id in (
                        select sd.order_id
                        from ${statusDetailsTable} as sd join (
                                select order_id, max(status_updated_at) as status_updated_at
                                from ${statusDetailsTable}
                                group by order_id
                            ) as tmp
                                on sd.status_updated_at = tmp.status_updated_at
                        where sd.status_id = :order_status_id
                    );

            `;
            [rows] = await connection.execute(preparedStmt, {
                customer_id: customerId,
                order_status_id: orderStatusId,
            });
        }
        const orders = [];
        if (rows.length > 0) {
            for (const row of rows) {
                const order = {
                    ...escapeData(row, [
                        'address_fullname',
                        'address_phone_number',
                        'address_detail',
                        'address_deleted_at',
                        'customer_id',
                    ]),
                };
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
        const productModel = new ProductModel();

        const currentDate = formatDateToString(new Date());

        const selectedList = await cartModel.getSelectedItems(customerId);
        if (selectedList.length === 0) {
            throw new Error('No product selected.');
        }
        // console.log('>>> debug: selectedList', selectedList);
        const { result: order, errors } = this.validateOrderData(payload);
        if (errors.length > 0) {
            throw new Error(errors.map((error) => error.msg).join(' '));
        }
        order['order_date'] = currentDate;
        const preparedStmt = `
            insert into ${this.table} (${Object.keys(order)
            .map((field) => field)
            .join(', ')})
                values (${Object.keys(order)
                    .map((field) => `:${field}`)
                    .join(', ')})
        `;
        await connection.execute(preparedStmt, order);

        const justAddedOrder = await this.getByDate(order.order_date);
        if (justAddedOrder) {
            for (const item of selectedList) {
                await orderDetailModel.add(justAddedOrder.order_id, item.detail.product_id, item.quantityInCart);
                await cartModel.delete(customerId, item.detail.product_id);

                const newQuantity = Number(item.quantityInCart) + Number(item.detail.product_sold_quantity);
                await productModel.update(item.detail.product_id, {
                    product_sold_quantity: newQuantity,
                });
            }
            const statusDetail = {
                status_id: process.env.STATUS_WAITING_FOR_CONFIRMATION,
                order_id: justAddedOrder.order_id,
                status_updated_at: currentDate,
                status_updated_by: `customer_${customerId}`,
            };
            await statusDetailModel.add(statusDetail);
        }
    }
    // update status of order
    async update(orderId, statusId, implementer = {}) {
        const statusDetailModel = new StatusDetailModel();

        let updatedBy = '';
        if (implementer.staff_id) {
            updatedBy = `staff_${implementer.staff_id}`;
        } else if (implementer.customer_id) {
            updatedBy = `customer_${implementer.customer_id}`;
        }
        if (updatedBy.length === 0) {
            throw new Error('Someone update status of order must be required.');
        }
        const statusDetail = {
            status_id: statusId,
            order_id: orderId,
            status_updated_at: formatDateToString(new Date()),
            status_updated_by: updatedBy,
        };
        await statusDetailModel.add(statusDetail);
    }
    // cancel order
    async destroy(orderId, implementer = {}) {
        await this.update(orderId, process.env.STATUS_CANCELLED, implementer);
    }
}

export default OrderModel;
