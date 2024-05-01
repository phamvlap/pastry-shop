import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import classNames from 'classnames/bind';
import { toast } from 'react-toastify';

import { OrderItemList, Button, InputGroup, Modal } from '~/components/index.js';
import AddressActions from '~/utils/addressActions.js';
import CartActions from '~/utils/cartActions.js';
import Helper from '~/utils/helper.js';
import OrderActions from '~/utils/orderActions.js';
import { PaymentService, VNPAYService } from '~/services/index.js';
import routes from '~/config/routes.js';

import styles from './UserCheckout.module.scss';

const cx = classNames.bind(styles);

const UserCheckout = () => {
    const [address, setAddress] = useState(null);
    const [itemList, setItemList] = useState([]);
    const [subTotal, setSubTotal] = useState(0);
    const [discount, setDiscount] = useState(0);
    const [total, setTotal] = useState(0);
    const [note, setNote] = useState('');
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState({});
    const [paymentMethod, setPaymentMethod] = useState([]);
    const [addressList, setAddressList] = useState([]);
    const [formattedItemList, setFormattedItemList] = useState([]);
    const [formAddress, setFormAddress] = useState({});
    const [errors, setErrors] = useState({});

    const navigate = useNavigate();
    const location = useLocation();
    const openBtnRef = useRef(null);
    const changeAddressBtnRef = useRef(null);

    const calculateTotal = () => {
        const subTotal = itemList.reduce((total, item) => {
            const originalPrice = Number(item.detail.price.price_value);
            return total + originalPrice * Number(item.quantityInCart);
        }, 0);
        const discount = itemList.reduce((total, item) => {
            const originalPrice = Number(item.detail.price.price_value);
            const discountRate = Number(item.detail.discount.discount_rate);
            return total + (originalPrice * discountRate * Number(item.quantityInCart)) / 100;
        }, 0);
        const total = subTotal - discount;
        setSubTotal(subTotal);
        setDiscount(discount);
        setTotal(total);
    };
    const fetchDefaultAddress = async () => {
        try {
            const response = await AddressActions.getDefaultAddress();
            if (response.status === 'success') {
                if (response.data === null) {
                    setAddress({
                        address_fullname: '',
                        address_phone_number: '',
                        address_detail: '',
                    });
                } else {
                    setAddress(response.data);
                    setFormAddress({
                        address_id: response.data.address_id,
                    });
                }
            }
        } catch (error) {
            console.log(error);
        }
    };
    const fetchCart = async () => {
        try {
            const response = await CartActions.getCart(true);
            if (response.status === 'success') {
                const orderItemList = response.data.map((item, index) => {
                    const priceValue =
                        Number(item.detail.price.price_value) -
                        (Number(item.detail.price.price_value) * Number(item.detail.discount.discount_rate)) / 100;
                    return {
                        index: index + 1,
                        imageSrc: Helper.formatImageUrl(item.detail.images[0].image_url),
                        name: item.detail.product_name,
                        price: priceValue,
                        quantity: item.quantityInCart,
                    };
                });
                setItemList(response.data);
                setFormattedItemList(orderItemList);
            }
        } catch (error) {
            console.log(error);
        }
    };
    const fetchPaymentMethod = async () => {
        try {
            const paymentService = new PaymentService();
            const response = await paymentService.getAll();
            if (response.status === 'success') {
                setPaymentMethod(response.data);
            }
        } catch (error) {
            console.log(error);
        }
    };
    const fetchAddresses = async () => {
        try {
            const response = await AddressActions.getAddresses();
            if (response.status === 'success') {
                setAddressList(response.data);
            }
        } catch (error) {
            console.log(error);
        }
    };
    const handleChangeNote = (event) => {
        setNote(event.target.value);
    };
    const handleSelectPaymnetMethod = (event) => {
        setSelectedPaymentMethod({
            pm_id: event.nativeEvent.target.id,
            pm_name: event.nativeEvent.target.innerText,
        });
        setErrors({
            ...errors,
            payment_method: '',
        });
    };
    const confirmCancelCheckout = () => {
        openBtnRef.current.click();
    };
    const handleCancelCheckout = () => {
        navigate(routes.userCart);
    };
    const openChangeAddressModal = () => {
        changeAddressBtnRef.current.click();
    };
    const handleOnChangeAddress = (event) => {
        setFormAddress({
            address_id: event.target.value,
        });
    };
    const setNewAddress = () => {
        const address = addressList.find((address) => address.address_id === Number(formAddress.address_id));
        setAddress(address);
    };
    const goToAddAddress = () => {
        navigate(routes.userAddressAdd, {
            state: {
                from: routes.userCheckout,
                state: {
                    address,
                    itemList,
                    selectedPaymentMethod,
                    note,
                },
            },
        });
    };
    const handleSubmitCheckout = async () => {
        try {
            const order = {
                order_total: total,
                order_note: note,
                pm_id: Number(selectedPaymentMethod.pm_id),
                address_id: address.address_id,
            };
            if (Object.keys(selectedPaymentMethod).length === 0) {
                setErrors({
                    ...errors,
                    payment_method: 'Vui lòng chọn phương thức thanh toán',
                });
            }
            if (Object.values(errors).filter((value) => value !== '').length > 0) {
                return;
            }
            const response = await OrderActions.createOrder(order);
            if (response.status === 'success') {
                toast.success('Đặt hàng thành công', {
                    duration: 1000,
                    onClose: () => {
                        navigate(routes.userOrders);
                    },
                });
            } else {
                toast.error('Đặt hàng thất bại', {
                    duration: 1000,
                    onClose: () => {
                        navigate(routes.userCart);
                    },
                });
            }
        } catch (error) {
            console.log(error);
        }
    };
    const redirectToVnpay = async (event) => {
        event.preventDefault();
        const vnpayService = new VNPAYService();
        const data = {
            amount: total,
            orderInfo: 'Thanh toán đơn hàng',
            orderType: 'billpayment',
        };
        console.log(data);
        const response = await vnpayService.create(data);
        if (response.status === 'success') {
            console.log(response.data);
            // window.location.href = response.data.vnpUrl;
        }
    };

    useEffect(() => {
        fetchAddresses();
        fetchPaymentMethod();
        fetchCart();
        if (location.state?.state) {
            setAddress(location.state.state.address);
            setFormAddress({
                address_id: location.state.state.address.address_id,
            });
            setItemList(location.state.state.itemList);
            setSelectedPaymentMethod(location.state.state.selectedPaymentMethod);
            setNote(location.state.state.note);
        } else {
            fetchDefaultAddress();
        }
    }, []);

    useEffect(() => {
        calculateTotal();
    }, [itemList]);

    return (
        <div className={cx('checkout-wrapper')}>
            <h3 className={cx('checkout-title')}>Xác nhận đặt hàng</h3>
            <div className={cx('checkout-content')}>
                <div className={cx('checkout-receiver')}>
                    <h2 className={cx('checkout-content__title')}>Thông tin nhận hàng</h2>
                    {address && (
                        <div className={cx('checkout-receiver__container')}>
                            <div className={cx('checkout-receiver__contact')}>
                                <div className={cx('checkout-receiver__contact-name')}>
                                    <span>Họ và tên người nhận:</span>
                                    <span>{address.address_fullname}</span>
                                </div>
                                <div className={cx('checkout-receiver__contact-phone')}>
                                    <span>Số điện thoại:</span>
                                    <span>{address.address_phone_number}</span>
                                </div>
                            </div>
                            <div className={cx('checkout-receiver__address')}>
                                <span>Địa chỉ:</span>
                                <span className={cx('checkout-receiver__address-content')}>
                                    {address.address_detail}
                                </span>
                            </div>
                        </div>
                    )}
                    <Button text onClick={() => openChangeAddressModal()}>
                        Thay đổi
                    </Button>
                </div>

                <div className={cx('checkout-list')}>
                    <OrderItemList itemList={formattedItemList} />
                </div>

                <div className={cx('checkout-payment')}>
                    <h2 className={cx('checkout-content__title')}>Phương thức thanh toán</h2>
                    <div className={cx('checkout-payment__container')}>
                        {paymentMethod.map((item) => (
                            <div className={cx('checkout-payment__method')} key={item.pm_id}>
                                <div
                                    id={item.pm_id}
                                    className={cx({
                                        'checkout-payment__method-item': true,
                                        'checkout-payment-active': Number(selectedPaymentMethod.pm_id) === item.pm_id,
                                    })}
                                    onClick={(event) => handleSelectPaymnetMethod(event)}
                                >
                                    {item.vn_pm_name}
                                </div>
                                <div className={cx('checkout-payment__pay')}>
                                    {Number(selectedPaymentMethod.pm_id) === item.pm_id &&
                                        selectedPaymentMethod.pm_name === 'VNPAY' && (
                                            <Button
                                                outline
                                                className={cx('checkout-payment__pay-btn')}
                                                onClick={(event) => redirectToVnpay(event)}
                                            >
                                                Thanh toán
                                            </Button>
                                        )}
                                </div>
                            </div>
                        ))}
                        {errors.payment_method && <span className="error">{errors.payment_method}</span>}
                    </div>
                </div>
                <div className={cx('checkout-note')}>
                    <h2 className={cx('checkout-content__title')}>Ghi chú đơn hàng</h2>
                    <InputGroup
                        type="textarea"
                        name="order_note"
                        placeholder="Nhập ghi chú đơn hàng"
                        rows={3}
                        value={note}
                        onChange={(event) => handleChangeNote(event)}
                    />
                </div>

                <div className={cx('checkout-total')}>
                    <div className={cx('row', 'checout-total__row')}>
                        <div className={cx('col col-md-3 offset-md-6')}>
                            <span>Tổng thanh toán tạm thời: </span>
                        </div>
                        <div className={cx('col col-md-3', 'checkout-total__item-value')}>
                            <span>{Helper.formatMoney(subTotal)}</span>
                            <span>VNĐ</span>
                        </div>
                    </div>
                    <div className={cx('row', 'checout-total__row')}>
                        <div className={cx('col col-md-3 offset-md-6')}>
                            <span>Giảm giá: </span>
                        </div>
                        <div className={cx('col col-md-3', 'checkout-total__item-value')}>
                            <span>{Helper.formatMoney(discount)}</span>
                            <span>VNĐ</span>
                        </div>
                    </div>
                    <div className={cx('row', 'checout-total__row')}>
                        <div className={cx('col col-md-3 offset-md-6')}>
                            <span>Tổng thanh toán: </span>
                        </div>
                        <div className={cx('col col-md-3', 'checkout-total__item-value')}>
                            <span>{Helper.formatMoney(total)}</span>
                            <span>VNĐ</span>
                        </div>
                    </div>
                </div>

                <div className={cx('checkout-actions')}>
                    <Button secondary onClick={() => confirmCancelCheckout()}>
                        Hủy bỏ
                    </Button>
                    <Button outline onClick={() => handleSubmitCheckout()}>
                        Đặt hàng
                    </Button>
                </div>
            </div>

            <Button ref={openBtnRef} data-bs-toggle="modal" data-bs-target="#confirm-cancel-checkout" hidden />
            <Modal
                id="confirm-cancel-checkout"
                title="Xác nhận hủy đặt hàng"
                buttons={[
                    {
                        type: 'secondary',
                        dismiss: 'modal',
                        text: 'Đóng',
                    },
                    {
                        type: 'primary',
                        text: 'Đồng ý',
                        dismiss: 'modal',
                        onClick: () => handleCancelCheckout(),
                    },
                ]}
            >
                <p>Bạn có chắc chắn muốn hủy đặt hàng không?</p>
            </Modal>

            <Button ref={changeAddressBtnRef} data-bs-toggle="modal" data-bs-target="#change-address"></Button>
            <Modal
                id="change-address"
                title="Thay đổi địa chỉ"
                buttons={[
                    {
                        type: 'outline',
                        dismiss: 'modal',
                        text: 'Thêm địa chỉ mới',
                        onClick: () => goToAddAddress(),
                    },
                    {
                        type: 'primary',
                        text: 'Xác nhận',
                        dismiss: 'modal',
                        onClick: () => setNewAddress(),
                    },
                ]}
            >
                <div className={cx('p-2 ', 'address-list-container')}>
                    {addressList.length > 0 ? (
                        addressList.map((address, index) => {
                            return (
                                <div className="form-check border-bottom py-2" key={index}>
                                    <input
                                        className="form-check-input"
                                        type="radio"
                                        name="selected_address"
                                        id={`address_${address.address_id}`}
                                        value={address.address_id}
                                        onChange={(event) => handleOnChangeAddress(event)}
                                        checked={Number(formAddress.address_id) === address.address_id}
                                    />
                                    <label
                                        className={cx('form-check-label', 'address-list__item-label')}
                                        htmlFor={`address_${address.address_id}`}
                                    >
                                        <p>{address.address_fullname}</p>
                                        <p>{address.address_phone_number}</p>
                                        <p>{address.address_detail}</p>
                                        {!!address.address_is_default && (
                                            <span className={cx('address-list__item-badge')}>Mặc định</span>
                                        )}
                                    </label>
                                </div>
                            );
                        })
                    ) : (
                        <p>Bạn chưa có địa chỉ nào.</p>
                    )}
                </div>
            </Modal>
        </div>
    );
};

export default UserCheckout;
