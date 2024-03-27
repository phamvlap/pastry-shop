import StaffService from '~/services/staff.service.js';

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
        const staffService = new StaffService();
        const response = await staffService.login(email, password);
        if (response.status !== 'success') {
            throw new Error('Error while login.');
        }
        const staff = {
            ...response.data.staff,
            expiredAt: new Date().getTime() + Number(response.data.staff.staff_expiresIn) * 1000,
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
        throw new Error(error.message);
    }
};

const logOut = () => {
    localStorage.removeItem(import.meta.env.VITE_LOCAL_STAFF_KEY);
};

export default { logIn, logOut, getToken, getStaff };
