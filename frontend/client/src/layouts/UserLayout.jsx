import { useEffect } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';

import Header from './partials/Header.jsx';
import Footer from './partials/Footer.jsx';
import UserNav from './partials/UserNav.jsx';
import { Breadcrumb } from '~/components/index.js';

import styles from './Layout.module.scss';

const cx = classNames.bind(styles);

const UserLayout = ({ children }) => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [window.location.pathname]);

    return (
        <div className={cx('user-layout-container')}>
            <Header />
            <Breadcrumb />
            <div className={cx('container', 'user-layout-body')}>
                <div className={cx('content-wrapper')}>
                    <div className="row">
                        <div className="col-md-2">
                            <UserNav />
                        </div>
                        <div className="col-md-10">{children}</div>
                    </div>
                </div>
            </div>
            <Footer className={cx('user-layout-footer')} />
        </div>
    );
};

UserLayout.propTypes = {
    children: PropTypes.node.isRequired,
};

export default UserLayout;
