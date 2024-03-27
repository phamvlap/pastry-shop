import createAPIService from "~/services/api.service.js";

class SupplierService {
    constructor(config = {}) {
        const { baseUrl = '/api/v1/suppliers', headers = {} } = config;
        this.api = createAPIService(baseUrl, headers);
    }
    async getAll() {
        return (await this.api.get('/')).data;
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

export default SupplierService;