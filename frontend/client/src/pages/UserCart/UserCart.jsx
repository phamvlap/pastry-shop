import { useState, useEffect } from 'react';
import classNames from 'classnames/bind';

import { CartItem, Button } from '~/components/index.js';
import CartActions from '~/utils/cartActions.js';
import Helper from '~/utils/helper.js';

import styles from '~/pages/UserCart/UserCart.module.scss';

const cx = classNames.bind(styles);

const UserCart = () => {
    const [cart, setCart] = useState([]);
    const [subTotal, setSubTotal] = useState(0);
    const [discount, setDiscount] = useState(0);
    const [total, setTotal] = useState(0);

    const fetchCart = async () => {
        const discardDetailKeys = [
            'product_description',
            'product_slug',
            'product_created_at',
            'product_updated_at',
            'supplier',
        ];
        const response = await CartActions.getCart();
        if (response.status === 'success') {
            const cartItems = response.data.map((item) => {
                return {
                    ...Helper.filterObject(item, ['detail']),
                    product: Helper.filterObject(item.detail, discardDetailKeys),
                };
            });
            setCart(cartItems);
        }
    };
    const calculateTotal = () => {
        const subTotal = cart.reduce((total, item) => {
            const originalPrice = item.statusItem ? Number(item.product.price.price_value) : 0;
            return total + originalPrice * Number(item.quantityInCart);
        }, 0);
        const discount = cart.reduce((total, item) => {
            const originalPrice = Number(item.product.price.price_value);
            const discountRate = Number(item.product.discount.discount_rate);
            return total + (item.statusItem ? originalPrice * discountRate * Number(item.quantityInCart) : 0);
        }, 0);
        const total = subTotal - discount;
        setSubTotal(subTotal);
        setDiscount(discount);
        setTotal(total);
    };

    useEffect(() => {
        fetchCart();
    }, []);

    useEffect(() => {
        calculateTotal();
    }, [cart]);

    return (
        <div className={cx('container')}>
            <div className={cx('cart-wrapper')}>
                <h3 className={cx('cart-title')}>Giỏ hàng</h3>
                <div className={cx('cart-content')}>
                    {cart.map((cartItem, index) => {
                        return <CartItem key={index} cartItem={cartItem} setCart={setCart} />;
                    })}
                </div>
            </div>
            <div className="row">
                <div className="col offset-md-6">
                    <div className={cx('cart-footer')}>
                        <div className={cx('cart-footer__tmp-total')}>
                            <span className={cx('cart-footer__total-label')}>Tổng tạm thời:</span>
                            <span className={cx('cart-footer__total-value')}>
                                <span>{Helper.formatMoney(subTotal)}</span>
                                <span>VNĐ</span>
                            </span>
                        </div>
                        <div className={cx('cart-footer__discount')}>
                            <span className={cx('cart-footer__total-label')}>Giảm giá:</span>
                            <span className={cx('cart-footer__total-value')}>
                                <span>{Helper.formatMoney(discount)}</span>
                                <span>VNĐ</span>
                            </span>
                        </div>
                        <div className={cx('cart-footer__total')}>
                            <span className={cx('cart-footer__total-label')}>Tổng thanh toán:</span>
                            <span className={cx('cart-footer__total-value')}>
                                <span>{Helper.formatMoney(total)}</span>
                                <span>VNĐ</span>
                            </span>
                        </div>
                        <div className={cx('cart-footer__button')}>
                            <Button primary to="/user/checkout">
                                Mua hàng
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserCart;
