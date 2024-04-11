import createAPIService from '~/services/api.service.js';

class RatingService {
    constructor(config = {}) {
        const { baseUrl = '/api/v1/ratings', headers = {} } = config;
        this.api = createAPIService(baseUrl, headers);
    }
    async getAll() {
        return (await this.api.get('/')).data;
    }
    async get(productId) {
        return (await this.api.get(`/${productId}`)).data;
    }
    async add(data) {
        return (await this.api.post('/', data)).data;
    }
}

export default RatingService;
