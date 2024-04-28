import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import classNames from 'classnames/bind';

import styles from '~/pages/Discount/Discount.module.scss';

const cx = classNames.bind(styles);

import { Table } from '~/components/index.js';

const header = {
    discount_code: {
        value: 'Mã giảm giá',
        isModified: false,
    },
    discount_rate: {
        value: 'Giá trị giảm giá (%)',
        isModified: false,
    },
    discount_limit: {
        value: 'Số lượng áp dụng',
        isModified: false,
    },
    discount_applied: {
        value: 'Số lượng đã áp dụng',
        isModified: false,
    },
    discount_start_view: {
        value: 'Ngày bắt đầu',
        isModified: false,
    },
    discount_end_view: {
        value: 'Ngày kết thúc',
        isModified: false,
    },
};

const actions = {
    edit: {
        value: 'Sửa',
        isDirected: false,
        isModifiedInRow: false,
    },
    delete: {
        value: 'Xóa',
        isDirected: false,
        isModifiedInRow: false,
    },
};
const fillable = [
    'discount_id',
    'discount_code',
    'discount_rate',
    'discount_limit',
    'discount_start_view',
    'discount_end_view',
];

const DiscountList = ({ discountList, setDiscountList, setDiscount }) => {
    const [activeRow, setActiveRow] = useState(null);

    useEffect(() => {
        setDiscount({ ...activeRow });
    }, [activeRow, setDiscount]);

    return (
        <div className={cx('discount-list')}>
            <h2 className={cx('discount-title')}>Danh sách mã giảm giá</h2>
            <div className={cx('discount-list__table')}>
                <Table
                    entityName="discount"
                    header={header}
                    fillable={fillable}
                    data={discountList}
                    setData={setDiscountList}
                    actions={actions}
                    activeRow={activeRow}
                    setActiveRow={setActiveRow}
                />
            </div>
        </div>
    );
};

DiscountList.propTypes = {
    discountList: PropTypes.array,
    setDiscountList: PropTypes.func,
    setDiscount: PropTypes.func,
};

export default DiscountList;
