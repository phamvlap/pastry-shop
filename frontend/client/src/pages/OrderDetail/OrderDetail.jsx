import classNames from 'classnames/bind';

import { OrderItemList, Button } from '~/components/index.js';
import styles from '~/pages/OrderDetail/OrderDetail.module.scss';

const cx = classNames.bind(styles);

const OrderDetail = () => {
    return (
        <div className={cx('order-wrapper')}>
            <h3 className={cx('order-title')}>Chi tiết đơn hàng</h3>
            <div className={cx('order-content')}>
                <div className={cx('order-review')}>
                    <div className={cx('order-review__item')}>
                        <span>Mã đơn hàng:</span>
                        <span>123456</span>
                    </div>
                    <div className={cx('order-review__item')}>
                        <span>Trạng thái:</span>
                        <span>Đang giao</span>
                    </div>
                    <div className={cx('order-review__item')}>
                        <span>Hình thức thanh toán:</span>
                        <span>Thanh toán khi nhận hàng</span>
                    </div>
                    <div className={cx('order-review__item')}>
                        <span>Đặt hàng lúc:</span>
                        <span>10:30 30/03/2024</span>
                    </div>
                    <div className={cx('order-review__item')}>
                        <span>Nhận hàng lúc:</span>
                        <span>10:30 31/03/2024</span>
                    </div>
                </div>
                <div className={cx('order-receiver')}>
                    <h2 className={cx('order-content__title')}>Thông tin người nhận</h2>
                    <div className={cx('order-receiver__container')}>
                        <div className={cx('order-receiver__contact')}>
                            <div className={cx('order-receiver__contact-name')}>
                                <span>Họ và tên:</span>
                                <span>Nguyễn Văn A</span>
                            </div>
                            <div className={cx('order-receiver__contact-phone')}>
                                <span>Số điện thoại:</span>
                                <span>0373339569</span>
                            </div>
                        </div>
                        <div className={cx('order-receiver__address')}>
                            <span>Địa chỉ:</span>
                            <span className={cx('order-receiver__address-content')}>
                                123 Đường ABC, Phường XYZ, Quận 1, TP. Hồ Chí Minh 123 Đường ABC, Phường XYZ, Quận 1,
                                TP. Hồ Chí Minh123 Đường ABC, Phường XYZ, Quận 1, TP. Hồ Chí Minh123 Đường ABC, Phường
                                XYZ, Quận 1, TP. Hồ Chí Minh
                            </span>
                        </div>
                    </div>
                </div>

                <div className={cx('order-list')}>
                    <OrderItemList />
                </div>

                <div className={cx('order-total')}>
                    <div className={cx('row', 'checout-total__row')}>
                        <div className={cx('col col-md-3 offset-md-6')}>
                            <span>Tổng thanh toán tạm thời: </span>
                        </div>
                        <div className={cx('col col-md-3', 'order-total__item-value')}>
                            <span>90000</span>
                            <span>VNĐ</span>
                        </div>
                    </div>
                    <div className={cx('row', 'checout-total__row')}>
                        <div className={cx('col col-md-3 offset-md-6')}>
                            <span>Giảm giá: </span>
                        </div>
                        <div className={cx('col col-md-3', 'order-total__item-value')}>
                            <span>10000</span>
                            <span>VNĐ</span>
                        </div>
                    </div>
                    <div className={cx('row', 'checout-total__row')}>
                        <div className={cx('col col-md-3 offset-md-6')}>
                            <span>Tổng thanh toán: </span>
                        </div>
                        <div className={cx('col col-md-3', 'order-total__item-value')}>
                            <span>80000</span>
                            <span>VNĐ</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetail;
