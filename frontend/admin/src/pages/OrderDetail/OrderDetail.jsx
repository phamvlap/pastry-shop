import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { faPenToSquare } from '@fortawesome/free-regular-svg-icons';

import { Button, OrderItemList, FormSelect } from '~/components/index.js';
import OrderActions from '~/utils/orderActions.js';
import Helper from '~/utils/helper.js';

import styles from './OrderDetail.module.scss';

const cx = classNames.bind(styles);

const OrderDetail = () => {
    const [order, setOrder] = useState(null);
    const [itemList, setItemList] = useState([]);
    const [form, setForm] = useState();

    const { id: orderId } = useParams();
    const closeBtnRef = useRef();

    const fetchOrder = async () => {
        try {
            const response = await OrderActions.getOrder(orderId);
            if (response.status === 'success') {
                const items = response.data.items.map((item, index) => {
                    return {
                        index: index + 1,
                        name: item.detail.product_name,
                        imageSrc: item.detail.images[0].image_url,
                        price:
                            Number(item.detail.price.price_value) -
                            Number(item.detail.price.price_value) * Number(item.detail.discount.discount_rate),
                        quantity: item.product_quantity,
                    };
                });
                const order = {
                    order_id: response.data.order_id,
                    order_note: response.data.order_note,
                    order_paymentMethod: response.data.paymentMethod.pm_name,
                    order_date: response.data.order_date,
                    order_status:
                        response.data && response.data.statusList.length > 0
                            ? response.data.statusList[response.data.statusList.length - 1].status.vn_status_name
                            : '',
                    order_total: parseInt(response.data.order_total),
                    customer: response.data.receiver,
                };
                setOrder(order);
                setItemList(items);
            }
        } catch (error) {
            setOrder(null);
        }
    };
    const handleChangeStatus = (event) => {
        setForm({
            ...form,
            [event.target.name]: event.target.value,
        });
    };
    const handleUpdateStatus = async (event) => {
        event.preventDefault();

        if (form && form.status_id) {
            try {
                const response = await OrderActions.updateOrder(orderId, form.status_id);
                if (response.status === 'success') {
                    await fetchOrder();
                    closeBtnRef.current.click();
                }
            } catch (error) {
                console.log(error);
            }
        }
    };
    useEffect(() => {
        fetchOrder();
    }, [orderId]);
    return (
        <div className={cx('order-detail-container')}>
            <h2 className={cx('order-detail-title')}>Chi tiết đơn hàng</h2>
            <div>
                <div className={cx('control-bar')}>
                    <Button to="/orders" outline leftIcon={<FontAwesomeIcon icon={faChevronLeft} />}>
                        Quay lại
                    </Button>
                    <Button
                        primary
                        leftIcon={<FontAwesomeIcon icon={faPenToSquare} />}
                        data-bs-toggle="modal"
                        data-bs-target="#update-order-status"
                    >
                        Cập nhật trạng thái
                    </Button>
                </div>
                {order && (
                    <div className="row">
                        <div className="col col-md-4">
                            <div className={cx('order-section__info')}>
                                <h2 className={cx('order-section__title')}>Thông tin đơn hàng</h2>
                                <div className={cx('order-info__item')}>
                                    <span className={cx('order-info__item-label')}>Mã đơn hàng:</span>
                                    <span>{order.order_id}</span>
                                </div>
                                <div className={cx('order-info__item')}>
                                    <span className={cx('order-info__item-label')}>Trạng thái:</span>
                                    <span>{order.order_status}</span>
                                </div>
                                <div className={cx('order-info__item')}>
                                    <span className={cx('order-info__item-label')}>Ghi chú đơn hàng:</span>
                                    <span>{order.order_note}</span>
                                </div>
                                <div className={cx('order-info__item')}>
                                    <span className={cx('order-info__item-label')}>Hình thức thanh toán:</span>
                                    <span>{order.order_paymentMethod}</span>
                                </div>
                                <div className={cx('order-info__item')}>
                                    <span className={cx('order-info__item-label')}>Đặt hàng lúc:</span>
                                    <span>{Helper.formatDateTime(order.order_date)}</span>
                                </div>
                                <div className={cx('order-info__item')}>
                                    <span className={cx('order-info__item-label')}>Nhận hàng lúc:</span>
                                    <span>10:30 31/03/2024</span>
                                </div>
                            </div>
                            <div className={cx('order-section__customer')}>
                                <h2 className={cx('order-section__title')}>Thông tin người nhận</h2>
                                <div className={cx('order-info__item')}>
                                    <span className={cx('order-info__item-label')}>Họ và tên:</span>
                                    <span>{order.customer.address_fullname}</span>
                                </div>
                                <div className={cx('order-info__item')}>
                                    <span className={cx('order-info__item-label')}>Số điện thoại:</span>
                                    <span>{order.customer.address_phone_number}</span>
                                </div>
                                <div className={cx('order-info__item')}>
                                    <span className={cx('order-info__item-label')}>Địa chỉ:</span>
                                    <span className={cx('order-receiver__address-content')}>
                                        {order.customer.address_detail}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="col col-md-8">
                            <OrderItemList itemList={itemList} />
                            <div className={cx('order-section__total')}>
                                <div className={cx('order-section__total-total')}>
                                    <span className={cx('order-section__total-label')}>Tổng tiền:</span>
                                    <span>{Helper.formatMoney(order.order_total) + ' VNĐ'}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div
                className={cx('modal fade', 'update-status-modal')}
                id="update-order-status"
                data-bs-backdrop="static"
                data-bs-keyboard="false"
                tabIndex="-1"
                aria-labelledby="update-order-status__label"
                aria-hidden="true"
            >
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5
                                className={cx('modal-title', 'update-status-modal__title')}
                                id="update-order-status__label"
                            >
                                Cập nhật trạng thái đơn hàng
                            </h5>
                            <button
                                ref={closeBtnRef}
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                            ></button>
                        </div>
                        <div className="modal-body">
                            <div className={cx('current-status')}>
                                <span className={cx('current-status__label')}>Trạng thái hiện tại:</span>
                                <span className={cx('current-status__value')}>{order?.order_status}</span>
                            </div>
                            <form>
                                <div className="input-group mb-3">
                                    <span className={cx('input-group-text', 'input-group-label')}>
                                        Chọn trạng thái mới:
                                    </span>
                                    <FormSelect
                                        name="status_id"
                                        value={form?.status_id}
                                        options={[
                                            {
                                                value: '0000',
                                                name: '-- Chọn --',
                                            },
                                            {
                                                value: '1002',
                                                name: 'Duyệt đơn hàng',
                                            },
                                            {
                                                value: '1003',
                                                name: 'Đang giao hàng',
                                            },
                                        ]}
                                        onChange={(event) => handleChangeStatus(event)}
                                    />
                                </div>
                            </form>
                        </div>
                        <div className="modal-footer">
                            <Button danger data-bs-dismiss="modal">
                                Hủy
                            </Button>
                            <Button success onClick={(event) => handleUpdateStatus(event)}>
                                Lưu
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetail;
