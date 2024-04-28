import PropTypes from 'prop-types';
import classNames from 'classnames/bind';

import Header from './partials/Header.jsx';
import SideNav from './partials/SideNav.jsx';
import Footer from './partials/Footer.jsx';

import styles from './Layout.module.scss';

const cx = classNames.bind(styles);

const MainLayout = ({ children }) => {
    return (
        <div className={cx('row', 'main-container')}>
            <div className={cx('col-md-2', 'main-sidebar')}>
                <SideNav />
            </div>
            <div className={cx('col-md-10', 'main-content')}>
                <div className={cx('main-content__wrapper')}>
                    <div className={cx('content-header')}>
                        <Header />
                    </div>
                    <div className={cx('content-body')}>{children}</div>
                    <div className={cx('content-footer')}>
                        <Footer />
                    </div>
                </div>
            </div>
        </div>
    );
};

MainLayout.propTypes = {
    children: PropTypes.object.isRequired,
};

export default MainLayout;
