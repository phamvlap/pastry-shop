import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import classNames from 'classnames/bind';

import styles from '~/pages/Discount/Discount.module.scss';

const cx = classNames.bind(styles);

import { Heading, Table } from '~/components/index.js';

const header = {
    discount_code: {
        value: 'Mã giảm giá',
        isModified: false,
    },
    discount_rate: {
        value: 'Giá trị giảm giá',
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
    discount_start: {
        value: 'Ngày bắt đầu',
        isModified: false,
    },
    discount_end: {
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
};

const DiscountList = ({ discountList, setDiscountList, setDiscount }) => {
    const [activeRow, setActiveRow] = useState(null);

    useEffect(() => {
        setDiscount({ ...activeRow });
    }, [activeRow, setDiscount]);

    return (
        <div className={cx('discount-list')}>
            <Heading title="Danh sách mã giảm giá" />
            <div className={cx('discount-list__table')}>
                <Table
                    entityName="discount"
                    header={header}
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
