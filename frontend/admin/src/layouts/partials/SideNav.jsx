import { useContext, useRef, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
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
import { faUserCircle } from '@fortawesome/free-regular-svg-icons';
import { toast } from 'react-toastify';

import { StaffContext } from '~/contexts/StaffContext.jsx';
import staffActions from '~/utils/staffActions.js';
import { Button, Modal } from '~/components/index.js';
import routes from '~/config/routes.js';

import styles from './../Layout.module.scss';

const cx = classNames.bind(styles);

const sideNavList = [
    {
        icon: faHome,
        name: 'Trang chủ ',
        to: routes.origin,
    },
    {
        icon: faList,
        name: ' Danh mục sản phẩm',
        to: routes.categories,
    },
    {
        icon: faWarehouse,
        name: 'Sản phẩm',
        to: routes.products,
    },
    {
        icon: faTag,
        name: 'Mã giảm giá',
        to: routes.discounts,
    },
    {
        icon: faReceipt,
        name: 'Đơn hàng',
        to: routes.orders,
    },
    {
        icon: faUserGroup,
        name: 'Khách hàng',
        to: routes.customers,
    },
    {
        icon: faUserTie,
        name: 'Nhân viên',
        to: routes.staffs,
    },
    {
        icon: faHandshakeAngle,
        name: 'Nhà cung ứng',
        to: routes.suppliers,
    },
    {
        icon: faChartPie,
        name: 'Thống kê',
        to: routes.statistics,
    },
    {
        icon: faGear,
        name: 'Cài đặt',
        to: routes.settings,
    },
];

const SideNav = () => {
    const [activeSideNav, setActiveSideNav] = useState(null);
    const { staff, setStaff, setToken, setIsAuthenticated } = useContext(StaffContext);

    const location = useLocation();
    const warningModalRef = useRef();

    const confirmLogout = () => {
        warningModalRef.current.click();
    };
    const handleLogout = () => {
        staffActions.logOut();
        setStaff(null);
        setToken('');
        setIsAuthenticated(false);
        toast.success('Đăng xuất thành công');
    };
    useEffect(() => {
        setActiveSideNav(location.pathname);
    }, [location.pathname]);

    return (
        <>
            <div className={cx('container-fluid', 'sidenav-container')}>
                <div className={cx('sidenav-head')}>
                    <div className={cx('sidenav-head__admin')}>
                        <FontAwesomeIcon icon={faUserCircle} className="me-2" />
                        <span>{staff ? staff.staff_email.split('@')[0] : ''}</span>
                    </div>
                </div>
                <ul className={cx('sidenav-list')}>
                    {activeSideNav &&
                        sideNavList.map((sideNav, index) => {
                            const sideNavLinkClass = cx('sidenav-item', {
                                active:
                                    sideNav.to === routes.origin
                                        ? activeSideNav === routes.origin || activeSideNav === routes.home
                                        : activeSideNav.includes(sideNav.to),
                            });
                            return (
                                <li key={index}>
                                    <Link to={sideNav.to} className={sideNavLinkClass}>
                                        <FontAwesomeIcon icon={sideNav.icon} className="me-2" />
                                        {sideNav.name}
                                    </Link>
                                </li>
                            );
                        })}
                </ul>
                <div className={cx('sidenav-footer')} onClick={confirmLogout}>
                    <span className={cx('sidenav-footer__inner')}>
                        <FontAwesomeIcon icon={faRightFromBracket} className="me-2" />
                        <span>Đăng xuất</span>
                    </span>
                </div>
            </div>

            <Button ref={warningModalRef} data-bs-toggle="modal" data-bs-target="#warn-logout" />
            <Modal
                id="warn-logout"
                title="Cảnh báo"
                buttons={[
                    {
                        type: 'secondary',
                        text: 'Hủy',
                        dismiss: 'modal',
                    },
                    {
                        type: 'primary',
                        text: 'Đồng ý',
                        onClick: () => handleLogout(),
                        dismiss: 'modal',
                    },
                ]}
            >
                <p>Bạn có chắc chắn muốn đăng xuất không?</p>
            </Modal>
        </>
    );
};

export default SideNav;
