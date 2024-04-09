import createAPIService from '~/services/api.service.js';

class StatusService {
    constructor(config = {}) {
        const { baseUrl = '/api/v1/status', headers = {} } = config;
        this.api = createAPIService(baseUrl, headers);
    }
    async getAll() {
        return (await this.api.get('/')).data;
    }
}

export default StatusService;
