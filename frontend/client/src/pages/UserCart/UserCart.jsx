import classNames from 'classnames/bind';
import { Link } from 'react-router-dom';

import CartItem from '~/components/CartItem/CartItem.jsx';
// import Button from '~/components/Button/Button.jsx';
import styles from '~/pages/UserCart/UserCart.module.scss';

const cx = classNames.bind(styles);

const UserCart = () => {
    return (
        <div className={cx('container')}>
            <div className={cx('cart-wrapper')}>
                <h3 className={cx('cart-title')}>Giỏ hàng</h3>
                <div className={cx('cart-content')}>
                    <CartItem />
                    <CartItem />
                    <CartItem />
                    <CartItem />
                    <CartItem />
                </div>
            </div>
            <div className="row">
                <div className="col offset-md-6">
                    <div className={cx('cart-footer')}>
                        <div className={cx('cart-footer__tmp-total')}>
                            <span className={cx('cart-footer__total-label')}>Tổng tạm thời:</span>
                            <span className={cx('cart-footer__total-value')}>500.000 VNĐ</span>
                        </div>
                        <div className={cx('cart-footer__discount')}>
                            <span className={cx('cart-footer__total-label')}>Giảm giá:</span>
                            <span className={cx('cart-footer__total-value')}>50.000 VNĐ</span>
                        </div>
                        <div className={cx('cart-footer__total')}>
                            <span className={cx('cart-footer__total-label')}>Tổng thanh toán:</span>
                            <span className={cx('cart-footer__total-value')}>450.000 VNĐ</span>
                        </div>
                        <div className={cx('cart-footer__button')}>
                            <Link to="/user/checkout">Đặt hàng</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserCart;
