import classNames from 'classnames/bind';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';

import styles from '~/layouts/Layout.module.scss';

const cx = classNames.bind(styles);

const UserNav = () => {
    return (
        <div className={cx('user-nav-wrapper')}>
            <h2 className={cx('user-nav-header')}>
                <span className={cx('user-nav-header__avatar')}>
                    <FontAwesomeIcon icon={faUser} />
                </span>
                <span className={cx('user-nav-header__name')}>phamlap</span>
            </h2>
            <ul className={cx('user-nav-list')}>
                <li>
                    <Link to="/user/profile" className={cx('user-nav-list__item')}>
                        Tài khoản
                    </Link>
                </li>
                <li>
                    <Link to="/user/address" className={cx('user-nav-list__item')}>
                        Địa chỉ
                    </Link>
                </li>
                <li>
                    <Link to="/user/password" className={cx('user-nav-list__item')}>
                        Đổi mật khẩu
                    </Link>
                </li>
                <li>
                    <Link to="/user/order" className={cx('user-nav-list__item')}>
                        Đơn hàng
                    </Link>
                </li>
                <li>
                    <Link to="/user/cart" className={cx('user-nav-list__item')}>
                        Giỏ hàng
                    </Link>
                </li>
            </ul>
        </div>
    );
};

export default UserNav;
