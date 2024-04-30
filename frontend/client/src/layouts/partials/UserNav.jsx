import { useState, useEffect, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faUserTag,
    faLocation,
    faKey,
    faReceipt,
    faCartShopping,
    faArrowRightFromBracket,
} from '@fortawesome/free-solid-svg-icons';

import Helper from '~/utils/helper.js';
import { UserContext } from '~/contexts/UserContext.jsx';
import routes from '~/config/routes.js';
import { Logout } from '~/components/index.js';

import styles from './../Layout.module.scss';

const cx = classNames.bind(styles);

const menu = [
    {
        name: 'Tài khoản',
        path: routes.userProfile,
        icon: faUserTag,
    },
    {
        name: 'Địa chỉ',
        path: routes.userAddress,
        icon: faLocation,
    },
    {
        name: 'Đổi mật khẩu',
        path: routes.userPassword,
        icon: faKey,
    },
    {
        name: 'Đơn hàng',
        path: routes.userOrders,
        icon: faReceipt,
    },
    {
        name: 'Giỏ hàng',
        path: routes.userCart,
        icon: faCartShopping,
    },
];

const UserNav = () => {
    const [currentPath, setCurrentPath] = useState('');

    const { user } = useContext(UserContext);
    const location = useLocation();

    useEffect(() => {
        setCurrentPath(location.pathname);
    }, [location.pathname]);
    return (
        <div className={cx('user-nav-wrapper')}>
            {user && (
                <h2 className={cx('user-nav-header')}>
                    <span className={cx('user-nav-header__avatar')}>
                        <img src={Helper.formatImageUrl(user.customer_avatar.image_url)} alt="" />
                    </span>
                    <span className={cx('user-nav-header__name')}>{user.customer_username}</span>
                </h2>
            )}
            <ul className={cx('user-nav-list')}>
                {currentPath.length > 0 &&
                    menu.map((item, index) => {
                        return (
                            <li key={index}>
                                <Link
                                    to={item.path}
                                    className={cx('user-nav-list__link', {
                                        active:
                                            item.path === routes.userProfile
                                                ? [routes.user, routes.userProfile].includes(currentPath)
                                                : currentPath.includes(item.path),
                                    })}
                                >
                                    <FontAwesomeIcon icon={item.icon} />
                                    <span>{item.name}</span>
                                </Link>
                            </li>
                        );
                    })}
                <li className={cx('user-nav-list__item')}>
                    <Logout id="confirm-logout-modal-in-usernav" />
                </li>
                <li className={cx('user-nav-list__item')}>
                    <Link to={routes.products}>Tiếp tục mua hàng</Link>
                </li>
            </ul>
        </div>
    );
};

export default UserNav;
