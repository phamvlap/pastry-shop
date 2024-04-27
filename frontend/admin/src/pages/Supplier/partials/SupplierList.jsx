import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import classNames from 'classnames/bind';

import styles from '~/pages/Supplier/Supplier.module.scss';

const cx = classNames.bind(styles);

import { Table } from '~/components/index.js';

const header = {
    supplier_name: {
        value: 'Tên nhà cung ứng',
        isModified: false,
    },
    supplier_phone_number: {
        value: 'Số điện thoại',
        isModified: false,
    },
    supplier_email: {
        value: 'Email',
        isModified: false,
    },
    supplier_address: {
        value: 'Địa chỉ',
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

const SupplierList = ({ supplierList, setSupplierList, setSupplier }) => {
    const [activeRow, setActiveRow] = useState(null);

    useEffect(() => {
        setSupplier({ ...activeRow });
    }, [activeRow, setSupplier]);

    return (
        <div className={cx('supplier-list')}>
            <h2 className={cx('supplier-title')}>Danh sách nhà cung ứng</h2>
            <div className={cx('supplier-list__table')}>
                <Table
                    entityName="supplier"
                    header={header}
                    data={supplierList}
                    setData={setSupplierList}
                    actions={actions}
                    activeRow={activeRow}
                    setActiveRow={setActiveRow}
                />
            </div>
        </div>
    );
};

SupplierList.propTypes = {
    supplierList: PropTypes.array,
    setSupplierList: PropTypes.func,
    setSupplier: PropTypes.func,
};

export default SupplierList;
