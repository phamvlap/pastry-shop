import Validator from '~/utils/validator.js';

export default [
    {
        field: 'customer_name',
        method: 'isEmpty',
        validWhen: false,
        message: 'Họ tên không được để trống.',
    },
    {
        field: 'customer_name',
        method: 'isLength',
        args: [{ min: 3 }],
        validWhen: true,
        message: 'Họ tên phải có ít nhất 3 ký tự.',
    },
    {
        field: 'customer_phone_number',
        method: 'isEmpty',
        validWhen: false,
        message: 'Số điện thoại không được để trống.',
    },
    {
        field: 'customer_phone_number',
        method: Validator.isPhoneNumber,
        validWhen: true,
        message: 'Số điện thoại không hợp lệ.',
    },
    {
        field: 'customer_username',
        method: 'isEmpty',
        validWhen: false,
        message: 'Tên đăng nhập không được để trống.',
    },
    {
        field: 'customer_username',
        method: 'isLength',
        args: [{ min: 3 }],
        validWhen: true,
        message: 'Tên đăng nhập phải có ít nhất 3 ký tự.',
    },
    {
        field: 'customer_password',
        method: 'isEmpty',
        validWhen: false,
        message: 'Mật khẩu không được để trống.',
    },
    {
        field: 'customer_password',
        method: Validator.isPassword,
        validWhen: true,
        message: 'Mật khẩu phải ít nhất 8 ký tư bao gồm chữ số và chữ cái.',
    },
    {
        field: 'customer_confirm_password',
        method: 'isEmpty',
        validWhen: false,
        message: 'Nhập lại mật khẩu không được để trống.',
    },
];
