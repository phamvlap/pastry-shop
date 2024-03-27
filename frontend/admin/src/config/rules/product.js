import Validator from '~/utils/validator.js';

export default [
    {
        field: 'product_name',
        method: 'isEmpty',
        validWhen: false,
        message: 'Tên sản phẩm là bắt buộc',
    },
    {
        field: 'product_name',
        method: 'isLength',
        args: [
            {
                min: 3,
            },
        ],
        validWhen: true,
        message: 'Tên sản phẩm tối thiểu 3 ký tự',
    },
    {
        field: 'product_stock_quantity',
        method: 'isEmpty',
        validWhen: false,
        message: 'Số lượng sản phẩm là bắt buộc',
    },
    {
        field: 'product_price',
        method: Validator.isNumber,
        validWhen: true,
        message: 'Giá bán phải là lớn hơn 0.',
    },
    {
        field: 'product_description',
        method: 'isEmpty',
        validWhen: false,
        message: 'Mô tả sản phẩm là bắt buộc',
    },
    {
        field: 'product_expire_date',
        method: Validator.checkValidDate,
        validWhen: true,
        message: 'Ngày hết hạn không hợp lệ.',
    },
    {
        field: 'product_category',
        method: Validator.isSelected,
        validWhen: true,
        message: 'Danh mục sản phẩm là bắt buộc',
    },
    {
        field: 'product_supplier',
        method: Validator.isSelected,
        validWhen: true,
        message: 'Nhà cung ứng là bắt buộc',
    },
    {
        field: 'product_discount',
        method: Validator.isSelected,
        validWhen: true,
        message: 'Mã giảm giá là bắt buộc',
    },
    {
        field: 'product_images',
        method: Validator.isUploaded,
        validWhen: true,
        message: 'Ảnh sản phẩm là bắt buộc',
    },
];
