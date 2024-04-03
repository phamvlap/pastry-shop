import classNames from 'classnames/bind';

import { OrderItemList, Button } from '~/components/index.js';
import styles from '~/pages/UserCheckout/UserCheckout.module.scss';

const cx = classNames.bind(styles);

const UserCheckout = () => {
    return (
        <div className={cx('checkout-wrapper')}>
            <h3 className={cx('checkout-title')}>Xác nhận đặt hàng</h3>
            <div className={cx('checkout-content')}>
                <div className={cx('checkout-receiver')}>
                    <h2 className={cx('checkout-content__title')}>Thông tin nhận hàng</h2>
                    <div className={cx('checkout-receiver__container')}>
                        <div className={cx('checkout-receiver__contact')}>
                            <div className={cx('checkout-receiver__contact-name')}>
                                <span>Họ và tên người nhận:</span>
                                <span>Nguyễn Văn A</span>
                            </div>
                            <div className={cx('checkout-receiver__contact-phone')}>
                                <span>Số điện thoại:</span>
                                <span>0373339569</span>
                            </div>
                        </div>
                        <div className={cx('checkout-receiver__address')}>
                            <span>Địa chỉ:</span>
                            <span className={cx('checkout-receiver__address-content')}>
                                123 Đường ABC, Phường XYZ, Quận 1, TP. Hồ Chí Minh 123 Đường ABC, Phường XYZ, Quận 1,
                                TP. Hồ Chí Minh123 Đường ABC, Phường XYZ, Quận 1, TP. Hồ Chí Minh123 Đường ABC, Phường
                                XYZ, Quận 1, TP. Hồ Chí Minh
                            </span>
                        </div>
                    </div>
                </div>

                <div className={cx('checkout-list')}>
                    <OrderItemList />
                </div>

                <div className={cx('checkout-payment')}>
                    <h2 className={cx('checkout-content__title')}>Phương thức thanh toán</h2>
                    <div className={cx('checkout-payment__container')}>
                        <div className={cx('checkout-payment__method')}>
                            <span>Thanh toán khi nhận hàng</span>
                        </div>
                        <div className={cx('checkout-payment__method')}>
                            <span>Thanh toán trực tuyến bằng cổng VNPAY</span>
                        </div>
                    </div>
                </div>

                <div className={cx('checkout-total')}>
                    <div className={cx('row', 'checout-total__row')}>
                        <div className={cx('col col-md-3 offset-md-6')}>
                            <span>Tổng thanh toán tạm thời: </span>
                        </div>
                        <div className={cx('col col-md-3', 'checkout-total__item-value')}>
                            <span>90000</span>
                            <span>VNĐ</span>
                        </div>
                    </div>
                    <div className={cx('row', 'checout-total__row')}>
                        <div className={cx('col col-md-3 offset-md-6')}>
                            <span>Giảm giá: </span>
                        </div>
                        <div className={cx('col col-md-3', 'checkout-total__item-value')}>
                            <span>10000</span>
                            <span>VNĐ</span>
                        </div>
                    </div>
                    <div className={cx('row', 'checout-total__row')}>
                        <div className={cx('col col-md-3 offset-md-6')}>
                            <span>Tổng thanh toán: </span>
                        </div>
                        <div className={cx('col col-md-3', 'checkout-total__item-value')}>
                            <span>80000</span>
                            <span>VNĐ</span>
                        </div>
                    </div>
                </div>

                <div className={cx('checkout-actions')}>
                    <Button primary>Đặt hàng</Button>
                </div>
            </div>
        </div>
    );
};

export default UserCheckout;
