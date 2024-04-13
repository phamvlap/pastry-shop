import { OrderService } from '~/services/index.js';
import StaffActions from '~/utils/staffActions.js';

const configApi = {
    headers: {
        authorization: `Bearer ${StaffActions.getToken()}`,
    },
};

class OrderActions {
    static async getAllOrders(filter = {}) {
        const orderService = new OrderService(configApi);
        const response = await orderService.getAll(filter);
        return response;
    }

    static async getOrder(id) {
        const orderService = new OrderService(configApi);
        const response = await orderService.get(id);
        return response;
    }

    static async updateOrder(id, statusId) {
        const orderService = new OrderService(configApi);
        const response = await orderService.update(id, {
            status_id: statusId,
        });
        return response;
    }

    static async cancelOrder(order) {
        // Cancel order
    }
}

export default OrderActions;
