import createAPIService from '~/services/api.service.js';

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
    async forgotPassword(payload) {
        let data = {};
        if (payload.account_email && !payload.account_username) {
            data = {
                account_email: payload.account_email,
                account_role: 'staff',
            };
        } else if (!payload.account_email && payload.account_username) {
            data = {
                account_username: payload.account_username,
                account_role: 'customer',
            };
        }
        return (await this.api.post('/forgot-password', data)).data;
    }
    async sendCode(payload) {
        let data = {};
        if (payload.account_email && !payload.account_username) {
            data = {
                account_email: payload.account_email,
                account_role: 'staff',
            };
        } else if (!payload.account_email && payload.account_username) {
            data = {
                account_username: payload.account_username,
                account_role: 'customer',
            };
        }
        data.email = payload.email;
        return (await this.api.post('/forgot-password/send', data)).data;
    }
    async verifyCode(payload) {
        let data = {};
        if (payload.account_email && !payload.account_username) {
            data = {
                account_email: payload.account_email,
                account_role: 'staff',
            };
        } else if (!payload.account_email && payload.account_username) {
            data = {
                account_username: payload.account_username,
                account_role: 'customer',
            };
        }
        data.code = payload.code;
        return (await this.api.post('/forgot-password/verify', data)).data;
    }
    async resetPassword(payload) {
        let data = {};
        if (payload.account_email && !payload.account_username) {
            data = {
                account_email: payload.account_email,
                account_role: 'staff',
            };
        } else if (!payload.account_email && payload.account_username) {
            data = {
                account_username: payload.account_username,
                account_role: 'customer',
            };
        }
        data.account_password = payload.account_password;
        return (await this.api.post('/forgot-password/reset', data)).data;
    }
}

export default AccountService;
