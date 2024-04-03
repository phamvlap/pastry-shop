import PropTypes from 'prop-types';
import classNames from 'classnames/bind';

import Header from '~/layouts/partials/Header.jsx';
import Footer from '~/layouts/partials/Footer.jsx';

import styles from '~/layouts/Layout.module.scss';

const cx = classNames.bind(styles);

const EmptyLayout = ({ children }) => {
    return (
        <div>
            <Header />
            <div className="container">
                <div className={cx('wrapper')}>{children}</div>
            </div>
            <Footer />
        </div>
    );
};

EmptyLayout.propTypes = {
    children: PropTypes.node.isRequired,
};

export default EmptyLayout;
