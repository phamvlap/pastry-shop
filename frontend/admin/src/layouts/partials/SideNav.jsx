import { Link } from 'react-router-dom';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faList,
    faHome,
    faWarehouse,
    faReceipt,
    faTag,
    faHandshakeAngle,
    faUserGroup,
    faRightFromBracket,
    faChartPie,
    faGear,
    faUserTie,
} from '@fortawesome/free-solid-svg-icons';
import PropTypes from 'prop-types';
import { useContext } from 'react';

import { StaffContext } from '~/contexts/StaffContext.jsx';
import staffActions from '~/utils/staffActions.js';
import styles from '~/layouts/Layout.module.scss';

const cx = classNames.bind(styles);

const sideNavList = [
    {
        icon: faHome,
        name: 'Trang chủ ',
        to: '/',
    },
    {
        icon: faList,
        name: ' Danh mục sản phẩm',
        to: '/categories',
    },
    {
        icon: faWarehouse,
        name: 'Sản phẩm',
        to: '/products',
    },
    {
        icon: faTag,
        name: 'Mã giảm giá',
        to: '/discounts',
    },
    {
        icon: faReceipt,
        name: 'Đơn hàng',
        to: '/orders',
    },
    {
        icon: faUserGroup,
        name: 'Khách hàng',
        to: '/customers',
    },
    {
        icon: faUserTie,
        name: 'Nhân viên',
        to: '/staffs',
    },
    {
        icon: faHandshakeAngle,
        name: 'Nhà cung ứng',
        to: '/suppliers',
    },
    {
        icon: faChartPie,
        name: 'Thống kê',
        to: '/statistics',
    },
    {
        icon: faGear,
        name: 'Cài đặt',
        to: '/settings',
    },
];

const SideNav = ({ activeSideNav, setActiveSideNav }) => {
    const { staff, setStaff, setToken, isAuthenticated, setIsAuthenticated } = useContext(StaffContext);

    const handleLogout = () => {
        staffActions.logOut();
        setStaff({});
        setToken('');
        setIsAuthenticated(false);
    };

    const handleChangeNavbar = (sideNav) => {
        setActiveSideNav(sideNav.to);
    };

    return (
        <div className={cx('container-fluid', 'sidenav-container')}>
            <div className={cx('sidenav-head')}>
                <h3 className={cx('sidenav-head__admin')}>{staff.staff_email || ''}</h3>
            </div>
            <ul className={cx('sidenav-list')}>
                {sideNavList.map((sideNav, index) => {
                    const sideNavLinkClass = cx('sidenav-item', {
                        active: activeSideNav === sideNav.to,
                    });
                    return (
                        <li key={index}>
                            <Link
                                to={sideNav.to}
                                className={sideNavLinkClass}
                                onClick={() => handleChangeNavbar(sideNav)}
                            >
                                <FontAwesomeIcon icon={sideNav.icon} className="me-2" />
                                {sideNav.name}
                            </Link>
                        </li>
                    );
                })}
            </ul>
            <div className={cx('sidenav-footer')} onClick={handleLogout}>
                <span className={cx('sidenav-footer__inner')}>
                    <FontAwesomeIcon icon={faRightFromBracket} className="me-2" />
                    <span>Đăng xuất</span>
                </span>
            </div>
        </div>
    );
};

SideNav.propTypes = {
    activeSideNav: PropTypes.string.isRequired,
    setActiveSideNav: PropTypes.func.isRequired,
};

export default SideNav;
