import Validator from '~/utils/validator.js';

export default [
    {
        field: 'staff_name',
        method: 'isEmpty',
        validWhen: false,
        message: 'Tên nhân viên là bắt buộc',
    },
    {
        field: 'staff_name',
        method: 'isLength',
        args: [
            {
                min: 2,
            },
        ],
        validWhen: true,
        message: 'Tên nhân viên phải có ít nhất 2 ký tự',
    },
    {
        field: 'staff_phone_number',
        method: 'isEmpty',
        validWhen: false,
        message: 'Số điện thoại là bắt buộc',
    },
    {
        field: 'staff_phone_number',
        method: Validator.isPhoneNumber,
        validWhen: true,
        message: 'Số điện thoại không hợp lệ',
    },
    {
        field: 'staff_address',
        method: 'isEmpty',
        validWhen: false,
        message: 'Địa chỉ là bắt buộc',
    },
    {
        field: 'staff_address',
        method: 'isLength',
        args: [
            {
                min: 6,
            },
        ],
        validWhen: true,
        message: 'Địa chỉ phải có ít nhất 6 ký tự',
    },
    {
        field: 'staff_role',
        method: 'isEmpty',
        validWhen: false,
        message: 'Chức vụ là bắt buộc',
    },
];
