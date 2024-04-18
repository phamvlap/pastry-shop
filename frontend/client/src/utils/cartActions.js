import { CustomerService } from '~/services/index.js';
import UserActions from '~/utils/userActions.js';

const configApi = {
    headers: {
        Authorization: `Bearer ${UserActions.getToken()}`,
    },
};

class CartActions {
    static async getCart(isSelected) {
        const customerService = new CustomerService(configApi);
        const cart = await customerService.getCart(isSelected);
        return cart;
    }

    static async addItem(item) {
        const data = {
            product_id: item.product_id,
            cart_quantity: item.cart_quantity,
            cart_is_selected: item.cart_is_selected,
        };
        const customerService = new CustomerService(configApi);
        const response = await customerService.addToCart(data);
        return response;
    }

    static async updateItem(itemId, payload) {
        const data = {
            cart_quantity: payload.cart_quantity,
            cart_is_selected: payload.cart_is_selected,
        };
        const customerService = new CustomerService(configApi);
        await customerService.updateCart(itemId, data);
    }

    static async removeItem(itemId) {
        const customerService = new CustomerService(configApi);
        await customerService.deleteCart(itemId);
    }

    static async clearCart() {
        const response = await this.getCart();
        if (response.status === 'success') {
            for (const item of response.data) {
                await this.removeItem(item.detail.product_id);
            }
        }
    }
}

export default CartActions;
