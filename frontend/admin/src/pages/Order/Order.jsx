import classNames from 'classnames/bind';
import ControlPanel from '~/pages/Order/partials/ControlPanel.jsx';
import { Table, Pagination } from '~/components/index.js';

import styles from '~/pages/Order/Order.module.scss';

const cx = classNames.bind(styles);

const header = {
    order_id: {
        value: 'Mã đơn hàng ',
        isModified: false,
    },
    order_date: {
        value: 'Ngày đặt hàng',
        isModified: false,
    },
    order_customer: {
        value: 'Khách hàng',
        isModified: false,
    },
    order_total: {
        value: 'Tổng tiền',
        isModified: false,
    },
    order_status: {
        value: 'Trạng thái',
        isModified: false,
    },
};
const actions = {
    detail: {
        value: 'Chi tiết',
        isDirected: true,
        isModifiedInRow: false,
    },
    edit: {
        value: 'Sửa',
        isDirected: true,
        isModifiedInRow: false,
    },
};

const Order = () => {
    return (
        <div className={cx('order-container')}>
            <h2 className={cx('order-title')}>Danh sách đơn hàng</h2>
            <ControlPanel />
            <div className="mt-3">
                <Table
                    // entityName="product"
                    header={header}
                    // data={productList}
                    // setData={setProductList}
                    actions={actions}
                    // setActiveRow={setActiveRow}
                />
            </div>
            <div className="mt-3">
                <Pagination
                // totalPages={totalPages}
                // currentPage={currentPage}
                // setCurrentPage={setCurrentPage}
                // recordsPerPage={recordsPerPage}
                // setRecordsPerPage={setRecordsPerPage}
                // recordOffset={recordOffset}
                // setRecordsOffset={setRecordOffset}
                />
            </div>
        </div>
    );
};

export default Order;
