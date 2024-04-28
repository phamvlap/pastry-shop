import classNames from 'classnames/bind';

import appConfig from '~/config/index.js';

import styles from './../Layout.module.scss';

const cx = classNames.bind(styles);

const Footer = () => {
    return (
        <div className={cx('container-fluid px-5 py-4 text-center', 'footer')} style={{ marginTop: 'auto' }}>
            <p>&copy; 2024 - {appConfig.app.name}</p>
        </div>
    );
};

export default Footer;
