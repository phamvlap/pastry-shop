import classNames from 'classnames/bind';
import PropTypes from 'prop-types';

import styles from '~/layouts/Layout.module.scss';

const cx = classNames.bind(styles);

const Footer = ({ className }) => {
    return (
        <div className={cx('footer-wrapper', className)}>
            <div className={cx('container', 'footer')}>Footer</div>
        </div>
    );
};

Footer.propTypes = {
    className: PropTypes.string,
};

export default Footer;
