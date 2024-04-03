import classNames from 'classnames/bind';

import styles from '~/layouts/Layout.module.scss';

const cx = classNames.bind(styles);

const Footer = () => {
    return (
        <div className={cx('footer-wrapper')}>
            <div className={cx('container', 'footer')}>Footer</div>
        </div>
    );
};

export default Footer;
