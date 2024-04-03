import classNames from 'classnames/bind';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping } from '@fortawesome/free-solid-svg-icons';

import { InputSearch } from '~/components/index.js';

import styles from '~/layouts/Layout.module.scss';

const cx = classNames.bind(styles);

const Header = () => {
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
                            {/* <Link to="/login" className={cx('action-account__item')}>
                                Đăng nhập
                            </Link>
                            <Link to="/register" className={cx('action-account__item')}>
                                Đăng ký
                            </Link> */}
                            <div className={cx('action-account_user')}>
                                <div className={cx('action-account_user-avatar')}>
                                    <img src="./../src/assets/images/avatars/avatar1.png" alt="" />
                                </div>
                                <div className={cx('action-account_user-username')}>phamlap</div>
                                <div className={cx('tooltip-user')}>
                                    <ul className={cx('tooltip-user__list')}>
                                        <li>
                                            <Link to="/user/profile" className={cx('tooltip-user__item')}>
                                                Tài khoản
                                            </Link>
                                        </li>
                                        <li>
                                            <Link to="/user/logout" className={cx('tooltip-user__item')}>
                                                Đăng xuất
                                            </Link>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className={cx('action-cart')}>
                            <FontAwesomeIcon icon={faCartShopping} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Header;
