import PropTypes from 'prop-types';
import classNames from 'classnames/bind';

import Header from '~/layouts/partials/Header.jsx';
import Footer from '~/layouts/partials/Footer.jsx';

import styles from '~/layouts/Layout.module.scss';

const cx = classNames.bind(styles);

const NotSidebarLayout = ({ children }) => {
    return (
        <div className={cx('not-sidebar__wrapper')}>
            <div className={cx('not-sidebar__header')}>
                <Header />
            </div>
            <div className={cx('not-sidebar__body')}>{children}</div>
            <div className={cx('not-sidebar__footer')}>
                <Footer />
            </div>
        </div>
    );
};

NotSidebarLayout.propTypes = {
    children: PropTypes.object.isRequired,
};

export default NotSidebarLayout;
