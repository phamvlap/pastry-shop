import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import classNames from 'classnames/bind';

import { OrderReview } from '~/components/index.js';
import OrderActions from '~/utils/orderActions.js';
import { StatusService } from '~/services/index.js';

import styles from './UserOrder.module.scss';

const cx = classNames.bind(styles);

const UserOrder = () => {
    const [orders, setOrders] = useState([]);
    const [statusList, setStatusList] = useState([]);
    const [activeFilter, setActiveFilter] = useState('all');

    const statusService = new StatusService();
    const navigate = useNavigate();
    const location = useLocation();

    const fetchOrders = async () => {
        const response = await OrderActions.getUserOrders(activeFilter);
        if (response.status === 'success') {
            setOrders(response.data);
        }
    };
    const handleChangeActiveFilter = (event) => {
        setActiveFilter(event.target.id.split('-')[2]);
    };
    const fetchStatusList = async () => {
        const response = await statusService.getAll();
        if (response.status === 'success') {
            setStatusList(response.data);
        }
    };

    useEffect(() => {
        fetchOrders();
        fetchStatusList();
        if (location.state?.activeFilter) {
            setActiveFilter(location.state.activeFilter.toString());
        }
    }, []);

    useEffect(() => {
        fetchOrders();
    }, [activeFilter]);

    return (
        <div className={cx('order-wrapper')}>
            <h3 className={cx('order-title')}>Danh sách đơn hàng</h3>
            <div className={cx('order-content')}>
                <div className={cx('order-filter')}>
                    <div
                        className={cx('order-filter__item', {
                            'order-filter__item-active': activeFilter === 'all',
                        })}
                        id="order-filter-all"
                        onClick={(event) => handleChangeActiveFilter(event)}
                    >
                        Tất cả đơn hàng
                    </div>
                    {statusList.map((status) => (
                        <div
                            key={status.status_id}
                            className={cx('order-filter__item', {
                                'order-filter__item-active': activeFilter === status.status_id.toString(),
                            })}
                            id={`order-filter-${status.status_id}`}
                            onClick={(event) => handleChangeActiveFilter(event)}
                        >
                            {status.vn_status_name}
                        </div>
                    ))}
                </div>
                <div className={cx('order-list')}>
                    {orders.length > 0 ? (
                        orders.map((order) => <OrderReview key={order.order_id} order={order} />)
                    ) : (
                        <div className={cx('order-empty')}>
                            <p>Không có đơn hàng nào.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserOrder;
