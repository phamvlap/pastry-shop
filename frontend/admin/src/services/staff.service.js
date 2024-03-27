import createAPIService from "~/services/api.service.js";

class StaffService {
    constructor(config = {}) {
        const { baseUrl = '/api/v1/staffs', headers = {} } = config;
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
    async login(email, password) {
        const data = {
            staff_email: email,
            staff_password: password,
        }
        return (await this.api.post('/login', data)).data;
    }
    async changePassword(password, newPassword, confirmPassword) {
        const data = {
            password,
            new_password: newPassword,
            confirm_password: confirmPassword,
        }
        return (await this.api.post('/password', data)).data;
    }
    async update(id, data) {
        return (await this.api.patch(`/${id}`, data)).data;
    }
    async delete(id) {
        return (await this.api.delete(`/${id}`)).data;
    }
}

export default StaffService;