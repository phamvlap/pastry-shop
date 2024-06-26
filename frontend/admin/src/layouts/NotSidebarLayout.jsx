import PropTypes from 'prop-types';
import classNames from 'classnames/bind';

import Header from './partials/Header.jsx';
import Footer from './partials/Footer.jsx';

import styles from './Layout.module.scss';

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
