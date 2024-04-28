import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { faPenToSquare } from '@fortawesome/free-regular-svg-icons';
import { toast } from 'react-toastify';

import { Button, OrderItemList, FormSelect, Modal } from '~/components/index.js';
import OrderActions from '~/utils/orderActions.js';
import Helper from '~/utils/helper.js';
import routes from '~/config/routes.js';
import UserRole from '~/enums/UserRole.js';

import styles from './OrderDetail.module.scss';

const cx = classNames.bind(styles);

const OrderDetail = () => {
    const [order, setOrder] = useState(null);
    const [itemList, setItemList] = useState([]);
    const [statusList, setStatusList] = useState([]);
    const [currentStatus, setCurrentStatus] = useState();
    const [form, setForm] = useState({
        status_id: '',
    });
    const [errors, setErrors] = useState({});

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
                            (Number(item.detail.price.price_value) * Number(item.detail.discount.discount_rate)) / 100,
                        quantity: item.product_quantity,
                    };
                });
                const order = {
                    order_id: response.data.order_id,
                    order_note: response.data.order_note,
                    order_paymentMethod: response.data.paymentMethod.vn_pm_name,
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
                setStatusList(response.data.statusList);
                setCurrentStatus(response.data.statusList[response.data.statusList.length - 1]);
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
    const validateForm = () => {
        const errors = {};
        if (form.status_id === '') {
            errors.status_id = 'Vui lòng chọn trạng thái mới';
        } else if (
            Helper.validateOrderStatus(statusList[statusList.length - 1].status.status_id, Number(form.status_id)) ===
            false
        ) {
            errors.status_id = 'Trạng thái mới không hợp lệ';
        }
        console.log(errors);
        setErrors(errors);
        return Object.keys(errors).length === 0;
    };
    const handleUpdateStatus = async (event) => {
        event.preventDefault();

        if (!validateForm()) {
            return;
        }
        try {
            const response = await OrderActions.updateOrder(orderId, form.status_id);
            if (response.status === 'success') {
                toast.success('Cập nhật trạng thái mới cho đơn hàng thành công', {
                    onClose: async () => {
                        setForm({ status_id: '' });
                        setErrors({});
                        await fetchOrder();
                        closeBtnRef.current.click();
                    },
                });
            }
        } catch (error) {
            console.log(error);
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
                    <Button to={routes.orders} outline leftIcon={<FontAwesomeIcon icon={faChevronLeft} />}>
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
                                    <span>
                                        {currentStatus.status.status_id === 1004
                                            ? Helper.formatDateTime(currentStatus.updatedAt)
                                            : 'Chưa nhận hàng'}
                                    </span>
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
                            <div>
                                <OrderItemList itemList={itemList} />
                                <div className={cx('order-section__total')}>
                                    <div className={cx('order-section__total-total')}>
                                        <span className={cx('order-section__total-label')}>Tổng thanh toán:</span>
                                        <span>{Helper.formatMoney(order.order_total) + ' VNĐ'}</span>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <h2 className={cx('order-section__title')}>Thông tin chi tiết trạng thái</h2>
                                <div className={cx('status-content')}>
                                    <div className={cx('content-row')}>
                                        <div className="row">
                                            <div className={cx('col col-md-1', 'content-row__column')}>##</div>
                                            <div className={cx('col col-md-3', 'content-row__column')}>Thời gian</div>
                                            <div className={cx('col col-md-3', 'content-row__column')}>Trạng thái</div>
                                            <div className={cx('col col-md-3', 'content-row__column')}>
                                                Người cập nhật
                                            </div>
                                            <div className={cx('col col-md-2', 'content-row__column')}>Vai trò</div>
                                        </div>
                                    </div>
                                    {statusList &&
                                        statusList.map((status, index) => (
                                            <div className={cx('content-row')} key={index}>
                                                <div className="row">
                                                    <div className={cx('col col-md-1', 'content-row__column')}>
                                                        {index + 1}
                                                    </div>
                                                    <div className={cx('col col-md-3', 'content-row__column')}>
                                                        {Helper.formatDateTime(status.updatedAt)}
                                                    </div>
                                                    <div className={cx('col col-md-3', 'content-row__column')}>
                                                        {status.status.vn_status_name}
                                                    </div>
                                                    <div className={cx('col col-md-3', 'content-row__column')}>
                                                        {status.implementer.role === 'customer'
                                                            ? status.implementer.customer_name
                                                            : status.implementer.role === 'staff'
                                                            ? status.implementer.staff_name
                                                            : ''}
                                                    </div>
                                                    <div className={cx('col col-md-2', 'content-row__column')}>
                                                        {UserRole.retrieveRole(status.implementer.role.toUpperCase())}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <Modal
                id="update-order-status"
                title="Cập nhật trạng thái đơn hàng"
                buttons={[
                    {
                        type: 'secondary',
                        text: 'Hủy',
                        dismiss: 'modal',
                        onClick: () => {
                            setForm({ status_id: '' });
                            setErrors({});
                        },
                        ref: closeBtnRef,
                    },
                    {
                        type: 'success',
                        text: 'Lưu thay đổi',
                        onClick: (event) => handleUpdateStatus(event),
                    },
                ]}
            >
                <>
                    <div className={cx('current-status')}>
                        <span className={cx('current-status__label')}>Trạng thái hiện tại:</span>
                        <span className={cx('current-status__value')}>{order?.order_status}</span>
                    </div>
                    <form>
                        <div className="input-group mb-3">
                            <span className={cx('input-group-text', 'input-group-label')}>Chọn trạng thái mới:</span>
                            <FormSelect
                                name="status_id"
                                value={form?.status_id}
                                options={[
                                    {
                                        value: '',
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
                                    {
                                        value: '1005',
                                        name: 'Huỷ đơn hàng',
                                    },
                                ]}
                                disabled={
                                    statusList.length > 0 &&
                                    (statusList[statusList.length - 1].status.status_id === 1004 ||
                                        statusList[statusList.length - 1].status.status_id === 1005)
                                }
                                onChange={(event) => handleChangeStatus(event)}
                            />
                        </div>
                        {errors.status_id && <p className={cx('error')}>{errors.status_id}</p>}
                    </form>
                </>
            </Modal>
        </div>
    );
};

export default OrderDetail;
