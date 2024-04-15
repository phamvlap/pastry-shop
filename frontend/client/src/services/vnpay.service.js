import createAPIService from './api.service.js';

class VNPAYService {
    constructor(config = {}) {
        const { baseUrl = '/api/v1/payment/vnpay', headers = {} } = config;
        this.api = createAPIService(baseUrl, headers);
    }
    async create(data) {
        return (await this.api.post('/create', data)).data;
    }
}

export default VNPAYService;
