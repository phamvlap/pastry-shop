import createAPIService from '~/services/api.service.js';

class OrderService {
    constructor(config = {}) {
        const { baseUrl = '/api/v1/orders', headers = {} } = config;
        this.api = createAPIService(baseUrl, headers);
    }
    async getAll(filter = {}) {
        if (Object.keys(filter).length === 0) {
            return (await this.api.get('/')).data;
        }
        const query = Object.keys(filter)
            .map((key) => `${key}=${filter[key]}`)
            .join('&');
        return (await this.api.get(`/?${query}`)).data;
    }
    async get(id) {
        return (await this.api.get(`/${id}/detail`)).data;
    }
    async getForUser() {
        return (await this.api.get('/user')).data;
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
