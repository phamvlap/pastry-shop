import { Link } from 'react-router-dom';
import classNames from 'classnames/bind';

import routes from '~/config/routes.js';

import styles from './NotFound.module.scss';

const cx = classNames.bind(styles);

const NotFound = () => {
    return (
        <div className={cx('container')}>
            <div className={cx('not-found-wrapper')}>
                <h2 className={cx('title')}>Địa chỉ không tồn tại</h2>
                <p className={cx('description')}>
                    <span>
                        Địa chỉ bạn truy cập không tồn tại hoặc đã bị xóa. Vui lòng kiểm tra lại đường dẫn hoặc quay về{' '}
                    </span>
                    <Link to={routes.origin} className={cx('home-link')}>
                        trang chủ.
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default NotFound;
