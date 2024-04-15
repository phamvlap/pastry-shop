import createAPIService from './api.service.js';

class OrderService {
    constructor(config = {}) {
        const { baseUrl = '/api/v1/orders', headers = {} } = config;
        this.api = createAPIService(baseUrl, headers);
    }
    async getAll() {
        return (await this.api.get('/')).data;
    }
    async get(id) {
        return (await this.api.get(`/${id}/detail`)).data;
    }
    async getForUser(statusId) {
        return (await this.api.get(`/user/${statusId}`)).data;
    }
    async create(data) {
        return (await this.api.post('/', data)).data;
    }
    async update(id, data) {
        return (await this.api.patch(`/${id}`, data)).data;
    }
    async delete(id) {
        return (await this.api.delete(`/${id}`)).data;
    }
}

export default OrderService;
