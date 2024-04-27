import createAPIService from '~/services/api.service.js';

class StaffService {
    constructor(config = {}) {
        const { baseUrl = '/api/v1/staffs', headers = {} } = config;
        this.api = createAPIService(baseUrl, headers);
    }
    async getAll(query = {}) {
        let queryString = '';
        if (Object.keys(query).length > 0) {
            queryString = `?${new URLSearchParams(query).toString()}`;
        }
        return (await this.api.get(`/${queryString}`)).data;
    }
    async get(id) {
        return (await this.api.get(`/${id}`)).data;
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

export default StaffService;
