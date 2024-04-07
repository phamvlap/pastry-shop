export default [
    {
        field: 'customer_username',
        method: 'isEmpty',
        validWhen: false,
        message: 'Tên đăng nhập không được để trống.',
    },
    {
        field: 'customer_password',
        method: 'isEmpty',
        validWhen: false,
        message: 'Mật khẩu không được để trống.',
    },
];
