import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';

import { OrderItemList, Button } from '~/components/index.js';
import Helper from '~/utils/helper.js';
import styles from '~/pages/OrderDetail/OrderDetail.module.scss';

const cx = classNames.bind(styles);

const OrderDetail = () => {
    const [subTotal, setSubTotal] = useState(0);
    const [discount, setDiscount] = useState(0);
    const [total, setTotal] = useState(0);

    const location = useLocation();
    const order = location.state.order;

    const calculateTotal = () => {
        const subTotal = order.items.reduce((total, item) => {
            const originalPrice = Number(item.detail.price.price_value);
            return total + originalPrice * Number(item.product_quantity);
        }, 0);
        const discount = order.items.reduce((total, item) => {
            const originalPrice = Number(item.detail.price.price_value);
            const discountRate = Number(item.detail.discount.discount_rate);
            return total + originalPrice * discountRate * Number(item.product_quantity);
        }, 0);
        const total = subTotal - discount;
        setSubTotal(subTotal);
        setDiscount(discount);
        setTotal(total);
    };

    const currentStatus = order.statusList[order.statusList.length - 1]?.status.vn_status_name;
    const itemList = order.items.map((item, index) => {
        const imageSrc = Helper.formatImageUrl(item.detail.images[0].image_url);
        const name = item.detail.product_name;
        const price =
            Number(item.detail.price.price_value) -
            Number(item.detail.price.price_value) * Number(item.detail.discount.discount_rate);
        const quantity = item.product_quantity;
        return {
            index: index + 1,
            imageSrc,
            name,
            price,
            quantity,
        };
    });

    useEffect(() => {
        calculateTotal();
    }, []);

    return (
        <div className={cx('order-wrapper')}>
            <h3 className={cx('order-title')}>
                <div className={cx('order-back')}>
                    <Button
                        to="/user/order"
                        primary
                        className={cx('order-back-btn')}
                        leftIcon={<FontAwesomeIcon icon={faChevronLeft} />}
                    ></Button>
                </div>
                <span>Chi tiết đơn hàng</span>
            </h3>
            <div className={cx('order-content')}>
                <div className={cx('order-review')}>
                    <div className={cx('order-review__item')}>
                        <span>Mã đơn hàng:</span>
                        <span>{order.order_id}</span>
                    </div>
                    <div className={cx('order-review__item')}>
                        <span>Trạng thái:</span>
                        <span>{currentStatus}</span>
                    </div>
                    <div className={cx('order-review__item')}>
                        <span>Hình thức thanh toán:</span>
                        <span>{order.paymentMethod.pm_name}</span>
                    </div>
                    <div className={cx('order-review__item')}>
                        <span>Đặt hàng lúc:</span>
                        <span>{Helper.formatDateTime(order.order_date)}</span>
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
                                <span>{order.receiver.address_fullname}</span>
                            </div>
                            <div className={cx('order-receiver__contact-phone')}>
                                <span>Số điện thoại:</span>
                                <span>{order.receiver.address_phone_number}</span>
                            </div>
                        </div>
                        <div className={cx('order-receiver__address')}>
                            <span>Địa chỉ:</span>
                            <span className={cx('order-receiver__address-content')}>
                                {order.receiver.address_detail}
                            </span>
                        </div>
                    </div>
                </div>

                <div className={cx('order-list')}>
                    <OrderItemList itemList={itemList} />
                </div>

                <div className={cx('order-total')}>
                    <div className={cx('row', 'checout-total__row')}>
                        <div className={cx('col col-md-3 offset-md-6')}>
                            <span>Tổng thanh toán tạm thời: </span>
                        </div>
                        <div className={cx('col col-md-3', 'order-total__item-value')}>
                            <span>{Helper.formatMoney(subTotal)}</span>
                            <span>VNĐ</span>
                        </div>
                    </div>
                    <div className={cx('row', 'checout-total__row')}>
                        <div className={cx('col col-md-3 offset-md-6')}>
                            <span>Giảm giá: </span>
                        </div>
                        <div className={cx('col col-md-3', 'order-total__item-value')}>
                            <span>{Helper.formatMoney(discount)}</span>
                            <span>VNĐ</span>
                        </div>
                    </div>
                    <div className={cx('row', 'checout-total__row')}>
                        <div className={cx('col col-md-3 offset-md-6')}>
                            <span>Tổng thanh toán: </span>
                        </div>
                        <div className={cx('col col-md-3', 'order-total__item-value')}>
                            <span>{Helper.formatMoney(total)}</span>
                            <span>VNĐ</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetail;
