export default [
    {
        field: 'cur_password',
        method: 'isEmpty',
        validWhen: false,
        message: 'Mật khẩu hiện tại không được để trống.',
    },
    {
        field: 'cur_password',
        method: 'isLength',
        args: [{ min: 8 }],
        validWhen: true,
        message: 'Mật khẩu hiện tại phải có ít nhất 8 ký tự.',
    },
    {
        field: 'new_password',
        method: 'isEmpty',
        validWhen: false,
        message: 'Mật khẩu mới không được để trống.',
    },
    {
        field: 'new_password',
        method: 'isLength',
        args: [{ min: 8 }],
        validWhen: true,
        message: 'Mật khẩu mới phải có ít nhất 8 ký tự.',
    },
    {
        field: 'confirm_password',
        method: 'isEmpty',
        validWhen: false,
        message: 'Xác nhận mật khẩu không được để trống.',
    },
];
