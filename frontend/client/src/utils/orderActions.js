import { OrderService } from '~/services/index.js';
import UserActions from '~/utils/userActions.js';

const configApi = {
    headers: {
        authorization: `Bearer ${UserActions.getToken()}`,
    },
};

class OrderActions {
    static async getUserOrders(statusId) {
        const orderService = new OrderService(configApi);
        const response = await orderService.getForUser(statusId);
        return response;
    }

    static async getOrderById(orderId) {
        const orderService = new OrderService(configApi);
        const response = await orderService.get(orderId);
        return response;
    }

    static async createOrder(data) {
        const orderService = new OrderService(configApi);
        const order = {
            order_total: data.order_total,
            order_note: data.order_note,
            pm_id: data.pm_id,
            address_id: data.address_id,
        };
        const response = await orderService.create(order);
        return response;
    }

    static async updateOrder(id, order) {
        const orderService = new OrderService(configApi);
        const response = await orderService.update(id, {
            status_id: order.status_id,
        });
        return response;
    }

    static async cancelOrder(orderId) {
        const orderService = new OrderService(configApi);
        const response = await orderService.delete(orderId);
        return response;
    }
}

export default OrderActions;
