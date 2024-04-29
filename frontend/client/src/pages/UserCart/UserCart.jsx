import { useState, useEffect, useContext, useRef } from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames/bind';
import { toast } from 'react-toastify';

import { CartItem, Button, Modal } from '~/components/index.js';
import CartActions from '~/utils/cartActions.js';
import Helper from '~/utils/helper.js';
import { CartContext } from '~/contexts/CartContext.jsx';
import routes from '~/config/routes.js';

import styles from './UserCart.module.scss';

const cx = classNames.bind(styles);

const UserCart = () => {
    const [cart, setCart] = useState(null);
    const [subTotal, setSubTotal] = useState(0);
    const [discount, setDiscount] = useState(0);
    const [total, setTotal] = useState(0);

    const { setQuantityInCart } = useContext(CartContext);
    const openBtnRef = useRef(null);
    const closeBtnRef = useRef();

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
            return total + (item.statusItem ? (originalPrice * discountRate * Number(item.quantityInCart)) / 100 : 0);
        }, 0);
        const total = subTotal - discount;
        setSubTotal(subTotal);
        setDiscount(discount);
        setTotal(total);
    };
    const handleDeleteMultipleItems = async () => {
        if (cart) {
            const selectedItems = cart.filter((item) => item.statusItem);
            if (selectedItems.length === 0) {
                toast.error('Vui lòng chọn sản phẩm cần xóa');
                return;
            }
            let oldQuantity = 0;
            for (const item of selectedItems) {
                oldQuantity += item.quantityInCart;
                await CartActions.removeItem(item.product.product_id);
            }
            setCart((cart) => cart.filter((item) => !item.statusItem));
            setQuantityInCart((oldQuantityInCart) => oldQuantityInCart - oldQuantity);
        }
    };
    const handleClearAllCart = async () => {
        if (cart) {
            await CartActions.clearCart();
            setCart(null);
            setSubTotal(0);
            setDiscount(0);
            setTotal(0);
            setQuantityInCart(0);
            closeBtnRef.current.click();
        }
    };
    const handleConfirmClearAll = () => {
        openBtnRef.current.click();
    };

    useEffect(() => {
        fetchCart();
    }, []);

    useEffect(() => {
        if (cart) {
            calculateTotal();
        }
    }, [cart]);

    return (
        <div className={cx('container')}>
            <div className={cx('cart-wrapper')}>
                <h3 className={cx('cart-title')}>Giỏ hàng</h3>
                <div className={cx('cart-content')}>
                    {cart &&
                        cart.map((cartItem, index) => {
                            return <CartItem key={index} cartItem={cartItem} setCart={setCart} />;
                        })}
                </div>
            </div>
            <div className="row">
                {!cart || cart.length === 0 ? (
                    <div className="col col-md-12">
                        <div className={cx('cart-empty')}>
                            <img src="/src/assets/images/empty_cart.png" alt="" className={cx('cart-empty__image')} />
                            <div className={cx('cart-empty__content')}>
                                <p className={cx('cart-empty__text')}>Giỏ hàng của bạn đang trống</p>
                                <Button className={cx('cart-empty__link')} outline to={routes.products}>
                                    Tìm sản phẩm
                                </Button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="col col-md-6">
                            <div className={cx('cart-footer__left')}>
                                <div className={cx('cart-footer__left-item')}>
                                    <span onClick={() => handleDeleteMultipleItems()}>Xóa</span>
                                </div>
                                <div className={cx('cart-footer__left-item')}>
                                    <span onClick={() => handleConfirmClearAll()}>Xóa tất cả</span>
                                </div>
                                <div className={cx('cart-footer__left-item')}>
                                    <Link to={routes.products}>Tiếp tục mua hàng</Link>
                                </div>
                            </div>
                        </div>
                        <div className="col col-md-6">
                            <div className={cx('cart-footer__right')}>
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
                                    <Button primary to={routes.userCheckout}>
                                        Mua hàng
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>

            <button ref={openBtnRef} data-bs-toggle="modal" data-bs-target="#confirm-delete-cart-modal"></button>
            <Modal
                id="confirm-delete-cart-modal"
                title="Xác nhận"
                buttons={[
                    {
                        type: 'secondary',
                        text: 'Hủy',
                        dismiss: 'modal',
                        ref: closeBtnRef,
                    },
                    {
                        type: 'primary',
                        text: 'Xác nhận',
                        onClick: () => handleClearAllCart(),
                    },
                ]}
            >
                <span>Bạn có chắc chắn muốn xóa tất cả sản phẩm trong giỏ hàng không?</span>
            </Modal>
        </div>
    );
};

export default UserCart;
