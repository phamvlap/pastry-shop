import createAPIService from '~/services/api.service.js';

class ProductService {
    constructor(config = {}) {
        const { baseUrl = '/api/v1/products', headers = {} } = config;
        this.api = createAPIService(baseUrl, headers);
    }
    async getAll(limit, offset) {
        if (!limit && !offset) {
            return (await this.api.get('/')).data;
        }
        return (await this.api.get(`/?limit=${limit}&offset=${offset}`)).data;
    }
    async getTotal() {
        return (await this.api.get('/count')).data;
    }
    async getForCateogry(categoryId) {
        return (await this.api.get(`/category/${categoryId}`)).data;
    }
    async getForDiscount(discountId) {
        return (await this.api.get(`/discount/${discountId}`)).data;
    }
    async getCountByFilter(status, categoryId) {
        return (await this.api.get(`/filter/count?status=${status}&category=${categoryId}`)).data;
    }
    async getProductsByFilter(status, categoryId, limit, offset) {
        return (await this.api.get(`/filter?status=${status}&category=${categoryId}&limit=${limit}&offset=${offset}`))
            .data;
    }
    async getByFilter(categoryId, createdAtOrder, priceOrder, limit, offset) {
        return (
            await this.api.get(
                `/filter?&categoryId=${categoryId}&createdAtOrder=${createdAtOrder}&priceOrder=${priceOrder}&limit=${limit}&offset=${offset}`,
            )
        ).data;
    }
    async create(data) {
        return (await this.api.post('/', data)).data;
    }
    async get(id) {
        return (await this.api.get(`/${id}`)).data;
    }
    async update(id, data) {
        return (await this.api.patch(`/${id}`, data)).data;
    }
    async delete(id) {
        return (await this.api.delete(`/${id}`)).data;
    }
}

export default ProductService;
