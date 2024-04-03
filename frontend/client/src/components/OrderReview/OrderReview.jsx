import classNames from 'classnames/bind';

import { Button } from '~/components/index.js';
import styles from '~/components/OrderReview/OrderReview.module.scss';

const cx = classNames.bind(styles);

const OrderReview = () => {
    return (
        <div className={cx('container')}>
            <div className={cx('header')}>
                <div className={cx('order-id')}>
                    <span>Mã đơn hàng:</span>
                    <span>123456</span>
                </div>
                <div className={cx('order-status')}>
                    <span>Dang giao</span>
                </div>
            </div>
            <div className={cx('body')}>
                <div className={cx('order-item')}>
                    <div className={cx('row', 'order-item__row')}>
                        <div className="col col-md-8">
                            <div className={cx('order-item__info')}>
                                <img
                                    src="https://via.placeholder.com/100"
                                    alt="product"
                                    className={cx('order-item__info-image')}
                                />
                                <div>
                                    <p className={cx('order-item__info-name')}>Tên sản phẩm</p>
                                    <p className={cx('order-item__info-price')}>
                                        <span>45000</span>
                                        <span>VND</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="col col-md-2">2</div>
                        <div className="col col-md-2">
                            <div className={cx('order-item__subtotal')}>
                                <span>90000</span>
                                <span>VND</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className={cx('footer')}>
                <div>
                    <Button primary>Xem chi tiết</Button>
                </div>
                <div className={cx('order-total')}>
                    <span>Tổng giá trị:</span>
                    <span>90000 VND</span>
                </div>
            </div>
        </div>
    );
};

export default OrderReview;
