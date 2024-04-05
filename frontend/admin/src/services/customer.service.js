import createAPIService from '~/services/api.service.js';

class CustomerService {
    constructor(config = {}) {
        const { baseUrl = '/api/v1/customers', headers = {} } = config;
        this.api = createAPIService(baseUrl, headers);
    }
    async getAll() {
        return (await this.api.get('/')).data;
    }
    async getProfile() {
        return (await this.api.get('/profile')).data;
    }
    async register(data) {
        return (await this.api.post('/register', data)).data;
    }
    async update(data) {
        return (await this.api.patch('/', data)).data;
    }
    // async delete(id) {
    //     return (await this.api.delete(`/${id}`)).data;
    // }
    // addresses
    async getAddresses() {
        return (await this.api.get('/addresses')).data;
    }
    async addAddress(data) {
        return (await this.api.post('/addresses', data)).data;
    }
    async updateAddress(id, data) {
        return (await this.api.patch(`/addresses/${id}`, data)).data;
    }
    async deleteAddress(id) {
        return (await this.api.delete(`/addresses/${id}`)).data;
    }
    // cart
    async getCart() {
        return (await this.api.get('/cart')).data;
    }
    async addToCart(data) {
        return (await this.api.post('/cart', data)).data;
    }
    async updateCart(id, data) {
        return (await this.api.patch(`/cart/${id}`, data)).data;
    }
    async deleteCart(id) {
        return (await this.api.delete(`/cart/${id}`)).data;
    }
}

export default CustomerService;
