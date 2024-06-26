import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faTrashCan, faBan } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';

import { OrderItemList, Button, Modal } from '~/components/index.js';
import Helper from '~/utils/helper.js';
import OrderActions from '~/utils/orderActions.js';
import routes from '~/config/routes.js';

import styles from './OrderDetail.module.scss';

const cx = classNames.bind(styles);
const statusMapping = {
    1001: 'waiting',
    1002: 'confirmed',
    1003: 'shipping',
    1004: 'completed',
    1005: 'canceled',
};

const OrderDetail = () => {
    const [order, setOrder] = useState(null);
    const [itemList, setItemList] = useState(null);
    const [subTotal, setSubTotal] = useState(0);
    const [discount, setDiscount] = useState(0);
    const [total, setTotal] = useState(0);
    const [activeFilter, setActiveFilter] = useState('all');

    const { id: orderId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const openBtnRef = useRef(null);
    const closeBtnRef = useRef(null);

    const fetchOrder = async () => {
        try {
            const response = await OrderActions.getOrderById(orderId);
            if (response.status === 'success') {
                const itemList = response.data.items.map((item, index) => {
                    const imageSrc = Helper.formatImageUrl(item.detail.images[0].image_url);
                    const name = item.detail.product_name;
                    const price =
                        Number(item.detail.price.price_value) -
                        (Number(item.detail.price.price_value) * Number(item.detail.discount.discount_rate)) / 100;
                    const quantity = item.product_quantity;
                    return {
                        index: index + 1,
                        imageSrc,
                        name,
                        price,
                        quantity,
                    };
                });
                const subTotal = response.data.items.reduce((total, item) => {
                    const originalPrice = item.detail.price ? Number(item.detail.price.price_value) : 0;
                    return total + originalPrice * Number(item.product_quantity);
                }, 0);
                const discount = response.data.items.reduce((total, item) => {
                    const originalPrice = item.detail.price ? Number(item.detail.price.price_value) : 0;
                    const discountRate = item.detail.discount ? Number(item.detail.discount.discount_rate) / 100 : 0;
                    return total + originalPrice * discountRate * Number(item.product_quantity);
                }, 0);
                const total = subTotal - discount;
                setSubTotal(subTotal);
                setDiscount(discount);
                setTotal(total);
                setItemList(itemList);
                setOrder(response.data);
            }
        } catch (error) {
            setOrder(null);
        }
    };

    const confirmCancelOrder = () => {
        openBtnRef.current.click();
    };
    const implementCancelOrder = async () => {
        try {
            await OrderActions.cancelOrder(order.order_id);
            closeBtnRef.current.click();
            toast.success('Hủy đơn hàng thành công', {
                duration: 1000,
                onClose: () => {
                    navigate(
                        routes.userOrders,
                        {
                            state: {
                                activeFilter: 1005,
                            },
                        },
                        {
                            replace: true,
                        },
                    );
                },
            });
        } catch (error) {
            toast.error('Hủy đơn hàng thất bại');
        }
    };

    useEffect(() => {
        if (orderId) {
            fetchOrder();
        }
    }, [orderId]);

    useEffect(() => {
        if (location.state?.activeFilter) {
            setActiveFilter(location.state.activeFilter.toString());
        }
    }, []);

    return (
        <div className={cx('order-wrapper')}>
            <h3 className={cx('order-title')}>
                <div className={cx('order-back')}>
                    <Button
                        link
                        className={cx('order-back-btn')}
                        onClick={() => {
                            navigate(
                                routes.userOrders,
                                // {
                                //     state: {
                                //         activeFilter,
                                //     },
                                // },
                                // {
                                //     replace: true,
                                // },
                            );
                        }}
                    >
                        <FontAwesomeIcon icon={faChevronLeft} />
                        <span className="ms-2">Quay lại</span>
                    </Button>
                </div>
                <span>Chi tiết đơn hàng</span>
            </h3>
            <div className={cx('order-content')}>
                {order && (
                    <div className={cx('order-review')}>
                        <div className={cx('order-review__item')}>
                            <span>Mã đơn hàng:</span>
                            <span>{order.order_id}</span>
                        </div>
                        <div className={cx('order-review__item')}>
                            <span>Trạng thái hiện tại:</span>
                            <span
                                className={cx('order-review__item-status', {
                                    [`${
                                        statusMapping[order.statusList[order.statusList.length - 1]?.status.status_id]
                                    }-status`]: true,
                                })}
                            >
                                {order.statusList[order.statusList.length - 1]?.status.vn_status_name}
                            </span>
                        </div>
                        <div className={cx('order-review__item')}>
                            <span>Hình thức thanh toán:</span>
                            <span>{order.paymentMethod.vn_pm_name}</span>
                        </div>
                        <div className={cx('order-review__item')}>
                            <span>Đặt hàng lúc:</span>
                            <span>{Helper.formatDateTime(order.order_date)}</span>
                        </div>
                        <div className={cx('order-review__item')}>
                            <span>Nhận hàng lúc:</span>
                            <span>
                                {order.statusList[order.statusList.length - 1].status.status_id === 1004
                                    ? Helper.formatDateTime(order.statusList[order.statusList.length - 1].updatedAt)
                                    : 'Chưa nhận hàng'}
                            </span>
                        </div>
                        <div className={cx('order-review__item')}>
                            <span>Ghi chú:</span>
                            <span>{order.order_note}</span>
                        </div>
                    </div>
                )}
                <div className={cx('order-receiver')}>
                    <h2 className={cx('order-content__title')}>Thông tin người nhận</h2>
                    {order && (
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
                    )}
                </div>

                <div className={cx('order-list')}>{itemList && <OrderItemList itemList={itemList} />}</div>

                <div className={cx('row', 'order-footer')}>
                    <div className={cx('col col-md-6', 'order-cancel')}>
                        {order && (
                            <Button
                                secondary
                                className={cx({
                                    ['order-cancel__btn-disabled']:
                                        Number(order.statusList[order.statusList.length - 1]?.status.status_id) !==
                                        1001,
                                })}
                                leftIcon={
                                    <FontAwesomeIcon
                                        icon={
                                            Number(order.statusList[order.statusList.length - 1]?.status.status_id) ===
                                            1001
                                                ? faTrashCan
                                                : faBan
                                        }
                                    />
                                }
                                onClick={() => confirmCancelOrder()}
                            >
                                Hủy đặt hàng
                            </Button>
                        )}
                    </div>
                    <div className={cx('col col-md-6', 'order-total')}>
                        <div className={cx('row', 'checout-total__row')}>
                            <div className={cx('col col-md-8')}>
                                <span>Tổng thanh toán tạm thời: </span>
                            </div>
                            <div className={cx('col col-md-4', 'order-total__item-value')}>
                                <span>{Helper.formatMoney(subTotal)}</span>
                                <span>VNĐ</span>
                            </div>
                        </div>
                        <div className={cx('row', 'checout-total__row')}>
                            <div className={cx('col col-md-8')}>
                                <span>Giảm giá: </span>
                            </div>
                            <div className={cx('col col-md-4', 'order-total__item-value')}>
                                <span>{Helper.formatMoney(discount)}</span>
                                <span>VNĐ</span>
                            </div>
                        </div>
                        <div className={cx('row', 'checout-total__row')}>
                            <div className={cx('col col-md-8')}>
                                <span>Tổng thanh toán: </span>
                            </div>
                            <div className={cx('col col-md-4', 'order-total__item-value')}>
                                <span>{Helper.formatMoney(total)}</span>
                                <span>VNĐ</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <button ref={openBtnRef} data-bs-toggle="modal" data-bs-target="#cancel-order-modal"></button>
            <Modal
                id="cancel-order-modal"
                title="Xác nhận"
                buttons={[
                    {
                        type: 'secondary',
                        dismiss: 'modal',
                        text: 'Đóng',
                        ref: closeBtnRef,
                    },
                    {
                        type: 'primary',
                        text: 'Đồng ý',
                        onClick: () => implementCancelOrder(),
                    },
                ]}
            >
                <p>{order && `Bạn có chắc chắn muốn hủy đơn hàng ${order.order_id} không?`}</p>
            </Modal>
        </div>
    );
};

export default OrderDetail;
