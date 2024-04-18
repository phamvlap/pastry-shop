import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserTag, faLocation, faKey, faReceipt, faCartShopping } from '@fortawesome/free-solid-svg-icons';

import UserActions from '~/utils/userActions.js';
import Helper from '~/utils/helper.js';
import { UserContext } from '~/contexts/UserContext.jsx';

import styles from './../Layout.module.scss';

const cx = classNames.bind(styles);

const optionList = [
    {
        id: 1,
        name: 'Tài khoản',
        path: '/user/profile',
        icon: faUserTag,
    },
    {
        id: 2,
        name: 'Địa chỉ',
        path: '/user/address',
        icon: faLocation,
    },
    {
        id: 3,
        name: 'Đổi mật khẩu',
        path: '/user/password',
        icon: faKey,
    },
    {
        id: 4,
        name: 'Đơn hàng',
        path: '/user/order',
        icon: faReceipt,
    },
    {
        id: 5,
        name: 'Giỏ hàng',
        path: '/user/cart',
        icon: faCartShopping,
    },
];

const UserNav = () => {
    const [activeOption, setActiveOption] = useState(null);

    const { user } = useContext(UserContext);

    useEffect(() => {
        const path = window.location.pathname;
        const active = optionList.find((option) => path.startsWith(option.path));
        setActiveOption(active);
    });
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
                {optionList.map((option) => {
                    return (
                        <li key={option.id}>
                            <Link
                                to={option.path}
                                className={cx('user-nav-list__item', {
                                    active: activeOption && activeOption.path === option.path,
                                })}
                            >
                                <FontAwesomeIcon icon={option.icon} />
                                <span>{option.name}</span>
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default UserNav;
