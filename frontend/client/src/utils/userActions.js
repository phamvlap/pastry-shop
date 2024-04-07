import { AccountService } from '~/services/index.js';

class UserActions {
    static getToken() {
        const data = JSON.parse(localStorage.getItem(import.meta.env.VITE_LOCAL_USER_KEY));
        return data ? data.token : '';
    }

    static getUser() {
        const data = JSON.parse(localStorage.getItem(import.meta.env.VITE_LOCAL_USER_KEY));
        return data ? data.user : {};
    }

    static setUser(user) {
        localStorage.setItem(import.meta.env.VITE_LOCAL_USER_KEY, JSON.stringify({ user, token: this.getToken() }));
    }

    static async login(username, password) {
        try {
            const accountService = new AccountService();
            const response = await accountService.login(null, username, password);
            if (response.status !== 'success') {
                throw new Error('Invalid credentials');
            }
            const user = {
                ...response.data.data,
                expiredAt: new Date().getTime() + Number(response.data.expiresIn) * 1000,
            };
            const token = response.data.token;
            localStorage.setItem(import.meta.env.VITE_LOCAL_USER_KEY, JSON.stringify({ user, token }));
            return { user, token };
        } catch (error) {
            throw new Error(error.message);
        }
    }

    static logout() {
        localStorage.removeItem(import.meta.env.VITE_LOCAL_USER_KEY);
    }
}

export default UserActions;
