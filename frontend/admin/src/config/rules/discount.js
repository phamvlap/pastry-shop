import Validator from '~/utils/validator.js';

export default [
    {
        field: 'discount_code',
        method: 'isEmpty',
        validWhen: false,
        message: 'Tên danh mục là bắt buộc',
    },
    {
        field: 'discount_code',
        method: 'isLength',
        args: [
            {
                min: 3,
            },
        ],
        validWhen: true,
        message: 'Mã giảm giá tối thiểu 3 ký tự',
    },
    {
        field: 'discount_rate',
        method: Validator.isInRange,
        args: [
            {
                min: 0,
                max: 1,
            },
        ],
        validWhen: true,
        message: 'Tỷ lệ giảm giá phải trong khoảng 0 - 1.',
    },
    {
        field: 'discount_limit',
        method: Validator.isNumber,
        validWhen: true,
        message: 'Số lượng áp dụng phải là lớn hơn 0.',
    },
    {
        field: 'discount_start',
        method: Validator.checkValidDate,
        validWhen: true,
        message: 'Ngày bắt đầu không hợp lệ',
    },
    {
        field: 'discount_end',
        method: Validator.checkValidDate,
        validWhen: true,
        message: 'Ngày kết thúc không hợp lệ',
    },
    {
        field: 'discount_end',
        method: Validator.checkPeriod,
        args: ['discount_start'],
        validWhen: true,
        message: 'Ngày kết thúc phải lớn hơn ngày bắt đầu.',
    },
];
