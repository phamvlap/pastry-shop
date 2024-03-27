import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

import { Heading, Table } from '~/components/index.js';

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
};

const SupplierList = ({ supplierList, setSupplierList, setSupplier }) => {
    const [activeRow, setActiveRow] = useState(null);

    useEffect(() => {
        setSupplier({ ...activeRow });
    }, [activeRow, setSupplier]);

    return (
        <div>
            <Heading title="Danh sách nhà cung ứng" />
            <div className="py-3 mt-3">
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
