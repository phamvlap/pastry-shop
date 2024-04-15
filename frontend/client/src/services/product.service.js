import createAPIService from './api.service.js';

class ProductService {
    constructor(config = {}) {
        const { baseUrl = '/api/v1/products', headers = {} } = config;
        this.api = createAPIService(baseUrl, headers);
    }
    // query: object
    // product_name
    // category_id
    // supplier_id
    // discount_id
    // createdAtOrder
    // priceOrder
    // status
    // limit
    // offset
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
    async getCount(query = {}) {
        let stringQuery = '';
        if (Object.keys(query).length > 0) {
            stringQuery += '?';
            for (const key in query) {
                stringQuery += `${key}=${query[key]}&`;
            }
            stringQuery = stringQuery.slice(0, -1);
        }
        return (await this.api.get(`/count${stringQuery}`)).data;
    }
    async getById(id) {
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

export default ProductService;
