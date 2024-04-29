import { useContext } from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping } from '@fortawesome/free-solid-svg-icons';

import { InputSearch } from '~/components/index.js';
import { UserContext } from '~/contexts/UserContext.jsx';
import { CartContext } from '~/contexts/CartContext.jsx';
import UserActions from '~/utils/userActions.js';
import Helper from '~/utils/helper.js';
import routes from '~/config/routes.js';

import styles from './../Layout.module.scss';

const cx = classNames.bind(styles);

const Header = () => {
    const { user, setUser, setToken, setIsLogged } = useContext(UserContext);
    const { quantityInCart } = useContext(CartContext);
    const srcAvatar = user ? Helper.formatImageUrl(user.customer_avatar.image_url) : '';

    const handleLogout = () => {
        UserActions.logout();
        setUser(null);
        setToken('');
        setIsLogged(false);
    };

    return (
        <div className={cx('header-wrapper')}>
            <div className={cx('container', 'header')}>
                <Link to={routes.origin} className={cx('header-logo')}>
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
                                                <Link to={routes.userProfile} className={cx('tooltip-user__item')}>
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
                                    <Link to={routes.login} className={cx('action-account__item')}>
                                        Đăng nhập
                                    </Link>
                                    <Link to={routes.register} className={cx('action-account__item')}>
                                        Đăng ký
                                    </Link>
                                </>
                            )}
                        </div>
                        <div className={cx('action-cart')}>
                            <Link to={routes.userCart} className={cx('action-cart__item')}>
                                <FontAwesomeIcon icon={faCartShopping} />
                                {user && quantityInCart >= 0 && (
                                    <div className={cx('action-cart__badge')}>
                                        <span>{quantityInCart}</span>
                                    </div>
                                )}
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Header;
