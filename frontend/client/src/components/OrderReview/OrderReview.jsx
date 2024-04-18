import { useNavigate } from 'react-router-dom';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';

import { Button } from '~/components/index.js';
import Helper from '~/utils/helper.js';

import styles from './OrderReview.module.scss';

const cx = classNames.bind(styles);

const OrderReview = ({ order }) => {
    const statusMapping = {
        1001: 'waiting',
        1002: 'confirmed',
        1003: 'shipping',
        1004: 'completed',
        1005: 'canceled',
    };
    const navigate = useNavigate();
    const currentStatus = order.statusList[order.statusList.length - 1]?.status.vn_status_name;

    const handleRedirectToOrder = (orderId) => {
        navigate(`/user/order/${orderId}`, {
            state: {
                order,
            },
        });
    };
    return (
        <div className={cx('container')}>
            <div className={cx('header')}>
                <div className={cx('order-id')}>
                    <span>Mã đơn hàng:</span>
                    <span>{order.order_id}</span>
                </div>
                <div
                    className={cx('order-status', {
                        [`${
                            statusMapping[order.statusList[order.statusList.length - 1]?.status.status_id]
                        }-status`]: true,
                    })}
                >
                    <span>{currentStatus}</span>
                </div>
            </div>
            <div className={cx('body')}>
                {order.items.map((item, index) => {
                    const price =
                        Number(item.detail.price.price_value) -
                        Number(item.detail.price.price_value) * Number(item.detail.discount.discount_rate);
                    return (
                        <div key={index} className={cx('order-item')}>
                            <div className={cx('row', 'order-item__row')}>
                                <div className="col col-md-8">
                                    <div className={cx('order-item__info')}>
                                        <img
                                            src={Helper.formatImageUrl(item.detail.images[0].image_url)}
                                            alt="product"
                                            className={cx('order-item__info-image')}
                                        />
                                        <div>
                                            <p className={cx('order-item__info-name')}>{item.detail.product_name}</p>
                                            <p className={cx('order-item__info-price')}>
                                                <span>{Helper.formatMoney(price)}</span>
                                                <span>VND</span>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col col-md-2">
                                    <div className={cx('order-item__quantity')}>
                                        <span>x</span>
                                        <span>{item.product_quantity}</span>
                                    </div>
                                </div>
                                <div className="col col-md-2">
                                    <div className={cx('order-item__subtotal')}>
                                        <span>{Helper.formatMoney(price * Number(item.product_quantity))}</span>
                                        <span>VNĐ</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
            <div className={cx('footer')}>
                <div>
                    <Button outline onClick={() => handleRedirectToOrder(order.order_id)}>
                        Xem chi tiết
                    </Button>
                </div>
                <div className={cx('order-total')}>
                    <span>Tổng giá trị:</span>
                    <span>{Helper.formatMoney(parseInt(order.order_total))}</span>
                    <span>VND</span>
                </div>
            </div>
        </div>
    );
};

OrderReview.propTypes = {
    order: PropTypes.object.isRequired,
};

export default OrderReview;
