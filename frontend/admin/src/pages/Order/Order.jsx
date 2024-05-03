import { useState, useEffect } from 'react';
import classNames from 'classnames/bind';

import { Table, Pagination } from '~/components/index.js';
import ControlPanel from './partials/ControlPanel.jsx';
import OrderAction from '~/utils/orderActions.js';
import Helper from '~/utils/helper.js';

import styles from './Order.module.scss';

const cx = classNames.bind(styles);

const header = {
    order_id: {
        value: 'Mã đơn hàng',
        isModified: false,
    },
    order_date: {
        value: 'Ngày đặt hàng',
        isModified: false,
    },
    order_customer: {
        value: 'Tên khách hàng',
        isModified: false,
    },
    order_total: {
        value: 'Tổng tiền (VNĐ)',
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
    delete: {
        value: 'Xóa',
        isDirected: false,
        isModifiedInRow: false,
    },
};

const Order = () => {
    const [orderList, setOrderList] = useState([]);
    const [statusId, setStatusId] = useState(null);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    // const [recordsPerPage, setRecordsPerPage] = useState(Number(import.meta.env.VITE_DEFAULT_RECORDS_PER_PAGE)); // limit
    const [recordsPerPage, setRecordsPerPage] = useState(100); // limit

    const [currentPage, setCurrentPage] = useState(1);
    const [recordOffset, setRecordOffset] = useState(null); // offset
    const [totalRecords, setTotalRecords] = useState(0);
    const [totalPages, setTotalPages] = useState(null);
    const [orderTotalSort, setOrderTotalSort] = useState(null);
    const [activeRow, setActiveRow] = useState(null);
    const [searchOrderId, setSearchOrderId] = useState(null);

    const fetchOrders = async () => {
        const filter = {
            status_id: statusId === 'all' ? null : statusId,
            start_date: startDate === '' ? null : startDate, // yyyy-mm-dd
            end_date: endDate === '' ? null : endDate, // yyyy-mm-dd
            order_total: orderTotalSort === 'all' ? null : orderTotalSort,
            limit: recordsPerPage,
            offset: recordOffset,
        };
        const response = await OrderAction.getAllOrders(filter);

        if (response.status === 'success') {
            setTotalRecords(response.data.total);
            setTotalPages(Math.ceil(Number(response.data.count) / Number(recordsPerPage)));
            const orders = [];
            response.data.orders.forEach((order) => {
                orders.push({
                    order_id: order.order_id,
                    order_date: Helper.formatDateTime(order.order_date),
                    order_customer: order.receiver.address_fullname,
                    order_total: Helper.formatMoney(parseInt(order.order_total)),
                    order_status:
                        order.statusList.length > 0
                            ? order.statusList[order.statusList.length - 1].status.vn_status_name
                            : '',
                });
            });
            setOrderList(orders);
        }
    };
    useEffect(() => {
        fetchOrders();
        setRecordOffset((currentPage - 1) * recordsPerPage);
    }, [statusId, startDate, endDate, recordsPerPage, currentPage, recordOffset, orderTotalSort]);

    useEffect(() => {
        const fetchOneOrder = async () => {
            try {
                const response = await OrderAction.getOrder(searchOrderId);
                if (response.status === 'success') {
                    if (response.data) {
                        const order = {
                            order_id: response.data.order_id,
                            order_date: Helper.formatDateTime(response.data.order_date),
                            order_customer: response.data.receiver.address_fullname,
                            order_total: Helper.formatMoney(parseInt(response.data.order_total)) + ' VNĐ',
                            order_status:
                                response.data.statusList.length > 0
                                    ? response.data.statusList[response.data.statusList.length - 1].status
                                          .vn_status_name
                                    : '',
                        };
                        setOrderList([order]);
                    }
                } else {
                    setOrderList([]);
                }
            } catch (error) {
                setOrderList([]);
            }
        };
        if (searchOrderId !== '' && searchOrderId !== null) {
            fetchOneOrder();
        } else {
            fetchOrders();
        }
    }, [searchOrderId]);

    return (
        <div className={cx('order-container')}>
            <h2 className={cx('order-title')}>Danh sách đơn hàng</h2>
            <ControlPanel
                setSearchOrderId={setSearchOrderId}
                setStatusId={setStatusId}
                setStartDate={setStartDate}
                setEndDate={setEndDate}
                setOrderTotalSort={setOrderTotalSort}
            />
            <div className="mt-3">
                {orderList.length > 0 && (
                    <Table
                        entityName="order"
                        header={header}
                        data={orderList}
                        actions={actions}
                        activeRow={activeRow}
                        setActiveRow={setActiveRow}
                    />
                )}
            </div>
            <div className="mt-3">
                <Pagination
                    totalPages={totalPages}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    recordsPerPage={recordsPerPage}
                    setRecordsPerPage={setRecordsPerPage}
                    recordOffset={recordOffset}
                    setRecordsOffset={setRecordOffset}
                />
            </div>
        </div>
    );
};

export default Order;
