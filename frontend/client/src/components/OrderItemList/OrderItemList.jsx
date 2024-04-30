import className from 'classnames/bind';
import PropTypes from 'prop-types';

import { OrderItem } from '~/components/index.js';

import styles from './OrderItemList.module.scss';

const cx = className.bind(styles);

const OrderItemList = ({ itemList }) => {
    return (
        <>
            <h2 className={cx('title')}>Chi tiết đơn hàng</h2>
            <div className={cx('content')}>
                <div className={cx('content-row')}>
                    <div className="row">
                        <div className={cx('col col-md-1', 'content-row__column')}>##</div>
                        <div className={cx('col col-md-5', 'content-row__column')}>Sản phẩm</div>
                        <div className={cx('col col-md-2', 'content-row__column')}>Giá bán (VNĐ)</div>
                        <div className={cx('col col-md-2', 'content-row__column')}>Số lượng</div>
                        <div className={cx('col col-md-2', 'content-row__column')}>Thành tiền (VNĐ)</div>
                    </div>
                </div>
                {itemList.map((item, index) => (
                    <OrderItem key={index} item={item} />
                ))}
            </div>
        </>
    );
};

OrderItemList.propTypes = {
    itemList: PropTypes.array,
};

export default OrderItemList;
