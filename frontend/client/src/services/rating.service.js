import createAPIService from './api.service.js';

class RatingService {
    constructor(config = {}) {
        const { baseUrl = '/api/v1/ratings', headers = {} } = config;
        this.api = createAPIService(baseUrl, headers);
    }
    async getAll(filter = {}) {
        if (Object.keys(filter).length > 0) {
            const query = Object.keys(filter)
                .map((key) => `${key}=${filter[key]}`)
                .join('&');
            return (await this.api.get(`/?${query}`)).data;
        }
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
