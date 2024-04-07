import { useContext } from 'react';
import classNames from 'classnames/bind';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping } from '@fortawesome/free-solid-svg-icons';

import { InputSearch } from '~/components/index.js';
import { UserContext } from '~/contexts/UserContext.jsx';
import UserActions from '~/utils/userActions.js';

import styles from '~/layouts/Layout.module.scss';

const cx = classNames.bind(styles);

const Header = () => {
    const { user, setUser, token, setToken, isLogged, setIsLogged } = useContext(UserContext);
    const srcAvatar = user
        ? `${import.meta.env.VITE_UPLOADED_DIR}${user.customer_avatar.image_url.split('/uploads/')[1]}`
        : '';

    const handleLogout = () => {
        UserActions.logout();
        setUser(null);
        setToken('');
        setIsLogged(false);
    };

    return (
        <div className={cx('header-wrapper')}>
            <div className={cx('container', 'header')}>
                <Link to="/" className={cx('header-logo')}>
                    Pastry Shop
                </Link>
                <div className={cx('header-search')}>
                    <InputSearch />
                </div>
                <div className={cx('header-actions')}>
                    <div className={cx('actions-container')}>
                        <div className={cx('action-account')}>
                            {user ? (
                                <div className={cx('action-account_user')}>
                                    <div className={cx('action-account_user-avatar')}>
                                        <img src={srcAvatar} alt="" />
                                    </div>
                                    <div className={cx('action-account_user-username')}>{user.customer_username}</div>
                                    <div className={cx('tooltip-user')}>
                                        <ul className={cx('tooltip-user__list')}>
                                            <li>
                                                <Link to="/user/profile" className={cx('tooltip-user__item')}>
                                                    Tài khoản
                                                </Link>
                                            </li>
                                            <li>
                                                <span
                                                    onClick={() => handleLogout()}
                                                    className={cx('tooltip-user__item')}
                                                >
                                                    Đăng xuất
                                                </span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <Link to="/login" className={cx('action-account__item')}>
                                        Đăng nhập
                                    </Link>
                                    <Link to="/register" className={cx('action-account__item')}>
                                        Đăng ký
                                    </Link>
                                </>
                            )}
                        </div>
                        <div className={cx('action-cart')}>
                            <Link to="/user/cart" className={cx('action-cart__item')}>
                                <FontAwesomeIcon icon={faCartShopping} />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Header;
