import PropTypes from 'prop-types';
import classNames from 'classnames/bind';

import Header from '~/layouts/partials/Header.jsx';
import Footer from '~/layouts/partials/Footer.jsx';
import Sidebar from '~/layouts/partials/Sidebar.jsx';

import styles from '~/layouts/Layout.module.scss';

const cx = classNames.bind(styles);

const MainLayout = ({ children }) => {
    return (
        <div>
            <Header />
            <div className="container">
                <div className={cx('breadcrumb-wrapper')}>
                    <ul className={cx('breadcrumb')}>
                        <li className={cx('breadcrumb-item')}>Trang chủ</li>
                        <span className={cx('breadcrumb-seperate')}>/</span>
                        <li className={cx('breadcrumb-item')}>Danh muc</li>
                        <span className={cx('breadcrumb-seperate')}>/</span>
                        <li className={cx('breadcrumb-item')}>Do uong</li>
                    </ul>
                </div>
            </div>
            <div className="container">
                <div className={cx('content-wrapper')}>
                    <div className="row">
                        <div className="col-md-3">
                            <Sidebar />
                        </div>
                        <div className="col-md-9">{children}</div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

MainLayout.propTypes = {
    children: PropTypes.node.isRequired,
};

export default MainLayout;
