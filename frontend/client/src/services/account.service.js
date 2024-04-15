import createAPIService from './api.service.js';

class AccountService {
    constructor(config = {}) {
        const { baseUrl = '/api/v1/accounts', headers = {} } = config;
        this.api = createAPIService(baseUrl, headers);
    }
    async login(email, username, password) {
        let data = {};
        if (email && !username) {
            data = {
                account_email: email,
                account_password: password,
                account_role: 'staff',
            };
        } else if (!email && username) {
            data = {
                account_username: username,
                account_password: password,
                account_role: 'customer',
            };
        }
        return (await this.api.post('/login', data)).data;
    }
    async changePassword(id, password, newPassword, confirmPassword) {
        const data = {
            cur_password: password,
            new_password: newPassword,
            confirm_password: confirmPassword,
        };
        return (await this.api.post(`/${id}/password`, data)).data;
    }
}

export default AccountService;
