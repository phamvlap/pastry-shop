export default [
    {
        field: 'email',
        method: 'isEmpty',
        validWhen: false,
        message: 'Email là bắt buộc',
    },
    {
        field: 'email',
        method: 'isEmail',
        validWhen: true,
        message: 'Email không hợp lệ',
    },
    {
        field: 'password',
        method: 'isEmpty',
        validWhen: false,
        message: 'Password là bắt buộc',
    },
    {
        field: 'password',
        method: 'isLength',
        args: [{ min: 8 }],
        validWhen: true,
        message: 'Password phải có ít nhất 8 ký tự',
    },
];
