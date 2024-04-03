import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot } from '@fortawesome/free-solid-svg-icons';

import styles from '~/components/AddressItem/AddressItem.module.scss';
import { Button } from '~/components/index.js';

const cx = classNames.bind(styles);

const AddressItem = () => {
    return (
        <div className={cx('container')}>
            <div className="row">
                <div className="col col-md-6">
                    <div className={cx('address-info')}>
                        <div className={cx('address-info__contact')}>
                            <span className={cx('address-info__contact-name')}>Nguyễn Văn A</span>
                            <span className={cx('address-info__contact-phone')}>0373339569</span>
                            <span className={cx('address-info__contact-default')}>Mặc định</span>
                        </div>
                        <div className={cx('address-info__detail')}>
                            <span className={cx('address-info__detail-icon')}>
                                <FontAwesomeIcon icon={faLocationDot} />
                            </span>
                            <span className={cx('address-info__detail-content')}>
                                123 Đường ABC, Phường XYZ, Quận 1, TP. Hồ Chí Minh
                            </span>
                        </div>
                    </div>
                </div>
                <div className="col col-md-3 ms-auto">
                    <div className={cx('address-action')}>
                        <div className={cx('address-action__row')}>
                            <Button outline>Thiết lập mặc định</Button>
                        </div>
                        <div className={cx('address-action__row')}>
                            <Button outline>Sửa</Button>
                            <Button outline>Xóa</Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddressItem;
