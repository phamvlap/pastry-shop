import createAPIService from '~/services/api.service.js';

class CustomerService {
    constructor(config = {}) {
        const { baseUrl = '/api/v1/customers', headers = {} } = config;
        this.api = createAPIService(baseUrl, headers);
    }
    async getAll(query = {}) {
        let stringQuery = '';
        if (Object.keys(query).length > 0) {
            stringQuery += '?';
            for (const key in query) {
                stringQuery += `${key}=${query[key]}&`;
            }
            stringQuery = stringQuery.slice(0, -1);
        }
        return (await this.api.get(`/${stringQuery}`)).data;
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
    async lockAccount(id) {
        return (await this.api.patch(`/${id}/lock`)).data;
    }
    async unlockAccount(id) {
        return (await this.api.patch(`/${id}/unlock`)).data;
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
