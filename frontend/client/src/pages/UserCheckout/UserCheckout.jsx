import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames/bind';

import { OrderItemList, Button, InputGroup } from '~/components/index.js';
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
    const [paymentMethod, setPaymentMethod] = useState([]);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState({});

    const navigate = useNavigate();
    const orderItemList = itemList.map((item, index) => {
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
    const fetchAddresses = async () => {
        const response = await AddressActions.getDefaultAddress();
        setAddress(response.data);
    };
    const fetchCart = async () => {
        const response = await CartActions.getCart(true);
        setItemList(response.data);
    };
    const handleChangeNote = (event) => {
        setNote(event.target.value);
    };
    const fetchPaymentMethod = async () => {
        const paymentService = new PaymentService();
        const response = await paymentService.getAll();
        setPaymentMethod(response.data);
    };
    const handleSelectPaymnetMethod = (event) => {
        setSelectedPaymentMethod({
            pm_id: event.nativeEvent.target.id,
            pm_name: event.nativeEvent.target.innerText,
        });
    };
    const handleCheckout = async () => {
        const order = {
            order_total: total,
            order_note: note,
            pm_id: Number(selectedPaymentMethod.pm_id),
            address_id: address.address_id,
        };
        const response = await OrderActions.createOrder(order);
        if (response.status === 'success') {
            navigate(routes.userOrder);
        } else {
            navigate(routes.userCart);
        }
    };
    const redirectToVnpay = async (event) => {
        event.preventDefault();
        // const vnpayService = new VNPAYService();
        // const data = {
        //     amount: total,
        //     orderInfo: 'Thanh toán đơn hàng',
        //     orderType: 'billpayment',
        // };
        // const response = await vnpayService.create(data);
        // console.log(response);
        // if (response.status === 'success') {
        //     window.clearTimeout();
        //     window.location.href = response.data.vnpUrl;
        // }
    };

    useEffect(() => {
        fetchAddresses();
        fetchCart();
        fetchPaymentMethod();
    }, []);

    useEffect(() => {
        calculateTotal();
    });

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
                </div>

                <div className={cx('checkout-list')}>
                    <OrderItemList itemList={orderItemList} />
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
                                    {item.pm_name}
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
                    <Button outline onClick={(event) => handleCheckout(event)}>
                        Đặt hàng
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default UserCheckout;
