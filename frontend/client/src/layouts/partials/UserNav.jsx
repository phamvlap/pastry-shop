import classNames from 'classnames/bind';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

import UserActions from '~/utils/userActions.js';
import Helper from '~/utils/helper.js';

import styles from '~/layouts/Layout.module.scss';

const cx = classNames.bind(styles);

const optionList = [
    {
        id: 1,
        name: 'Tài khoản',
        path: '/user/profile',
    },
    {
        id: 2,
        name: 'Địa chỉ',
        path: '/user/address',
    },
    {
        id: 3,
        name: 'Đổi mật khẩu',
        path: '/user/password',
    },
    {
        id: 4,
        name: 'Đơn hàng',
        path: '/user/order',
    },
    {
        id: 5,
        name: 'Giỏ hàng',
        path: '/user/cart',
    },
];

const UserNav = () => {
    const [activeOption, setActiveOption] = useState(null);

    const user = UserActions.getUser();

    useEffect(() => {
        const path = window.location.pathname;
        const active = optionList.find((option) => option.path === path);
        setActiveOption(active);
    });
    return (
        <div className={cx('user-nav-wrapper')}>
            <h2 className={cx('user-nav-header')}>
                <span className={cx('user-nav-header__avatar')}>
                    <img src={Helper.formatImageUrl(user.customer_avatar.image_url)} alt="" />
                </span>
                <span className={cx('user-nav-header__name')}>{user.customer_username}</span>
            </h2>
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
                                {option.name}
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default UserNav;
