import AccountService from '~/services/account.service.js';

const getToken = () => {
    const data = JSON.parse(localStorage.getItem(import.meta.env.VITE_LOCAL_STAFF_KEY));
    return data ? data.token : '';
};

const getStaff = () => {
    const data = JSON.parse(localStorage.getItem(import.meta.env.VITE_LOCAL_STAFF_KEY));
    return data ? data.staff : {};
};

const logIn = async (email, password) => {
    try {
        const accountService = new AccountService();
        const response = await accountService.login(email, null, password);
        if (response.status !== 'success') {
            throw new Error('Error while login.');
        }
        const staff = {
            ...response.data.data,
            expiredAt: new Date().getTime() + Number(response.data.expiresIn) * 1000,
        };
        const token = response.data.token;
        localStorage.setItem(
            import.meta.env.VITE_LOCAL_STAFF_KEY,
            JSON.stringify({
                staff,
                token,
            }),
        );
        return {
            staff,
            token,
        };
    } catch (error) {
        console.log('error');
        throw new Error(error.message);
    }
};

const logOut = () => {
    localStorage.removeItem(import.meta.env.VITE_LOCAL_STAFF_KEY);
};

export default { logIn, logOut, getToken, getStaff };
