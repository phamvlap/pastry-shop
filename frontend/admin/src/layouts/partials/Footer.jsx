import classNames from 'classnames/bind';

import styles from '~/layouts/MainLayout/MainLayout.module.scss';

const cx = classNames.bind(styles);

const Footer = () => {
    return (
        <div className={cx('container-fluid px-5 py-4 text-center', 'footer')} style={{ marginTop: 'auto' }}>
            <p>&copy; 2024 - Thực hiện bởi Phạm Văn Lập</p>
        </div>
    );
};

export default Footer;
