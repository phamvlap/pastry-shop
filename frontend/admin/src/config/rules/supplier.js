export default [
    {
        field: 'supplier_name',
        method: 'isEmpty',
        validWhen: false,
        message: 'Tên nhà cung ứng là bắt buộc',
    },
    {
        field: 'supplier_name',
        method: 'isLength',
        args: [
            {
                min: 3,
            },
        ],
        validWhen: true,
        message: 'Tên nhà cung ứng tối thiểu 3 ký tự',
    },
    {
        field: 'supplier_phone_number',
        method: 'isEmpty',
        validWhen: false,
        message: 'SỐ địện thoại là bắt buộc',
    },
    {
        field: 'supplier_phone_number',
        method: 'isMobilePhone',
        args: ['vi-VN'],
        validWhen: true,
        message: 'Số điện thoại không hợp lệ',
    },
    {
        field: 'supplier_email',
        method: 'isEmpty',
        validWhen: false,
        message: 'Email là bắt buộc',
    },
    {
        field: 'supplier_email',
        method: 'isLength',
        args: [
            {
                min: 3,
            },
        ],
        validWhen: true,
        message: 'Email tối thiểu 3 ký tự',
    },
    {
        field: 'supplier_address',
        method: 'isEmpty',
        validWhen: false,
        message: 'Địa chỉ là bắt buộc',
    },
    {
        field: 'supplier_address',
        method: 'isLength',
        args: [
            {
                min: 3,
            },
        ],
        validWhen: true,
        message: 'Địa chỉ tối thiểu 3 ký tự',
    },
];
