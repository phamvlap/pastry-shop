import { ProductService } from '~/services/index.js';
import UserActions from '~/utils/userActions.js';

const configApi = {
    headers: {
        Authorization: `Bearer ${UserActions.getToken()}`,
    },
};

class ProductActions {
    static async getById(id) {
        const productService = new ProductService(configApi);
        const response = await productService.getById(id);
        return response;
    }
}

export default ProductActions;
