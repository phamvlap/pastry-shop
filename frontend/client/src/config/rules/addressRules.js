import Validator from '~/utils/validator.js';

export default [
    {
        field: 'address_fullname',
        method: 'isEmpty',
        validWhen: false,
        message: 'Tên người nhận không được để trống.',
    },
    {
        field: 'address_fullname',
        method: 'isLength',
        args: [{ min: 2 }],
        validWhen: true,
        message: 'Tên người nhận phải có ít nhất 2 ký tự.',
    },
    {
        field: 'address_phone_number',
        method: 'isEmpty',
        validWhen: false,
        message: 'Số điện thoại không được để trống.',
    },
    {
        field: 'address_phone_number',
        method: Validator.isPhoneNumber,
        validWhen: true,
        message: 'Số điện thoại không hợp lệ.',
    },
    {
        field: 'address_detail',
        method: 'isEmpty',
        validWhen: false,
        message: 'Địa chỉ không được để trống.',
    },
    {
        field: 'address_detail',
        method: 'isLength',
        args: [{ min: 10 }],
        validWhen: true,
        message: 'Địa chỉ phải có ít nhất 10 ký tự.',
    },
];
