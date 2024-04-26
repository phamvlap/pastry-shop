import { useContext } from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faHome } from '@fortawesome/free-solid-svg-icons';

import { StaffContext } from '~/contexts/StaffContext.jsx';
import { Button } from '~/components/index.js';
import styles from '~/layouts/Layout.module.scss';
import appConfig from '~/config/index.js';

const cx = classNames.bind(styles);

const Header = () => {
    const { isAuthenticated } = useContext(StaffContext);

    return (
        <div className={cx('header')}>
            <div className={cx('header-left')}>{appConfig.app.name}</div>
            <div className={cx('header-right')}>
                {!isAuthenticated ? (
                    <Button to="/login" outline leftIcon={<FontAwesomeIcon icon={faUser} />}>
                        Đăng nhập
                    </Button>
                ) : (
                    <Link to="/">
                        <FontAwesomeIcon icon={faHome} className={cx('header-icon')} />
                    </Link>
                )}
            </div>
        </div>
    );
};

export default Header;
