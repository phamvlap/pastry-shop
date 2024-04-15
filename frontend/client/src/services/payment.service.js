import createAPIService from './api.service.js';

class PaymentService {
    constructor(config = {}) {
        const { baseUrl = '/api/v1/payment-methods', headers = {} } = config;
        this.api = createAPIService(baseUrl, headers);
    }
    async getAll() {
        return (await this.api.get('/')).data;
    }
    async get(id) {
        return (await this.api.get(`/${id}`)).data;
    }
}

export default PaymentService;
