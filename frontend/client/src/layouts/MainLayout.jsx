import PropTypes from 'prop-types';
import classNames from 'classnames/bind';

import Header from '~/layouts/partials/Header.jsx';
import Footer from '~/layouts/partials/Footer.jsx';

import styles from '~/layouts/Layout.module.scss';

const cx = classNames.bind(styles);

const MainLayout = ({ children }) => {
    return (
        <div className={cx('empty-layout-container')}>
            <Header />
            <div className={cx('container', 'empty-layout-children')}>
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
