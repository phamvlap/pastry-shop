import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

import { Heading, Table } from '~/components/index.js';

const header = {
    discount_code: {
        value: 'Mã giảm giá',
        isModified: false,
    },
    discount_rate: {
        value: 'Tỉ lệ giảm giá',
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
        <div>
            <Heading title="Danh sách mã giảm giá" />
            <div className="py-3 mt-3">
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
