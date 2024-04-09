import classNames from 'classnames/bind';

import { OrderReview } from '~/components/index.js';
import AddressActions from '~/utils/addressActions.js';

import styles from '~/pages/UserOrder/UserOrder.module.scss';

const cx = classNames.bind(styles);

const UserOrder = () => {
    return (
        <div className={cx('order-wrapper')}>
            <h3 className={cx('order-title')}>Danh sách đơn hàng</h3>
            <div className={cx('order-content')}>
                <div className={cx('order-filter')}>
                    <span className={cx('order-filter__item')}>Tất cả đơn hàng</span>
                    <span className={cx('order-filter__item')}>Đang chờ duyệt</span>
                    <span className={cx('order-filter__item')}>Đã duyệt</span>
                    <span className={cx('order-filter__item')}>Đang giao hàng</span>
                    <span className={cx('order-filter__item')}>Đã nhận</span>
                    <span className={cx('order-filter__item')}>Đã hủy</span>
                </div>
                <div className={cx('order-list')}>
                    <OrderReview />
                    <OrderReview />
                    <OrderReview />
                    <OrderReview />
                    <OrderReview />
                </div>
            </div>
        </div>
    );
};

export default UserOrder;
