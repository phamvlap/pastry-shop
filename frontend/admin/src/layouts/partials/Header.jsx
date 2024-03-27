import classNames from 'classnames/bind';
import { useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';

import { StaffContext } from '~/contexts/StaffContext.jsx';
import { Button } from '~/components/index.js';
import styles from '~/layouts/MainLayout/MainLayout.module.scss';

const cx = classNames.bind(styles);

const Header = () => {
    const { staff, setStaff, setToken, isAuthenticated, setIsAuthenticated } = useContext(StaffContext);

    return (
        <div className={cx('header')}>
            <div className={cx('header-left')}>Hệ thống quản lý cửa hàng bách hóa tương lai</div>
            <div className={cx('header-right')}>
                {!isAuthenticated && (
                    <Button
                        to="/login"
                        outline
                        className={cx('header-right-button')}
                        leftIcon={<FontAwesomeIcon icon={faUser} />}
                    >
                        Đăng nhập
                    </Button>
                )}
            </div>
        </div>
    );
};

export default Header;
