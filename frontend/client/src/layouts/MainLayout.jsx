import { useEffect } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';

import Header from './partials/Header.jsx';
import Footer from './partials/Footer.jsx';

import styles from './Layout.module.scss';

const cx = classNames.bind(styles);

const MainLayout = ({ children }) => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [window.location.pathname]);

    return (
        <div className={cx('main-layout-container')}>
            <Header />
            <div className={cx('container', 'main-layout-children')}>
                <div className={cx('wrapper')}>{children}</div>
            </div>
            <Footer />
        </div>
    );
};

MainLayout.propTypes = {
    children: PropTypes.node.isRequired,
};

export default MainLayout;
