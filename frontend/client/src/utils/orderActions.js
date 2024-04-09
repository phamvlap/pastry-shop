import { OrderService } from '~/services/index.js';
import UserActions from '~/utils/userActions.js';

const configApi = {
    headers: {
        authorization: `Bearer ${UserActions.getToken()}`,
    },
};

class OrderActions {
    static async getOrders() {
        const orderService = new OrderService(configApi);
        const response = await orderService.getAll();
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
        // Update order
    }

    static async cancelOrder(order) {
        // Cancel order
    }
}

export default OrderActions;
