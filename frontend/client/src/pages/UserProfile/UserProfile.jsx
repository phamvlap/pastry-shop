import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faArrowUpFromBracket } from '@fortawesome/free-solid-svg-icons';

import { Button, InputItem } from '~/components/index.js';
import styles from '~/pages/UserProfile/UserProfile.module.scss';

const cx = classNames.bind(styles);

const UserProfile = () => {
    return (
        <div className={cx('container')}>
            <div className={cx('account-wrapper')}>
                <h3 className={cx('account-title')}>Tài khoản của tôi</h3>
                <div className={cx('account-content')}>
                    <div className="row">
                        <div className="col col-md-9">
                            <form className={cx('account-info')}>
                                <div className={cx('account-info__item')}>
                                    <div className={cx('row', 'account-info__item-row')}>
                                        <div className="col col-md-3">
                                            <span className={cx('account-info__label')}>Tên đăng nhập:</span>
                                        </div>
                                        <div className="col col-md-9">
                                            <InputItem
                                                type="text"
                                                name="customer_username"
                                                value="nguyena"
                                                className={cx('account-info__value')}
                                                disabled
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className={cx('account-info__item')}>
                                    <div className={cx('row', 'account-info__item-row')}>
                                        <div className="col col-md-3">
                                            <span className={cx('account-info__label')}>Họ và tên:</span>
                                        </div>
                                        <div className="col col-md-9">
                                            <InputItem
                                                type="text"
                                                name="customer_username"
                                                value="Nguyễn Văn A"
                                                className={cx('account-info__value')}
                                                disabled
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className={cx('account-info__item')}>
                                    <div className={cx('row', 'account-info__item-row')}>
                                        <div className="col col-md-3">
                                            <span className={cx('account-info__label')}>Số điện thoại:</span>
                                        </div>
                                        <div className="col col-md-9">
                                            <InputItem
                                                type="text"
                                                name="customer_username"
                                                value="0373338569"
                                                className={cx('account-info__value')}
                                                disabled
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className={cx('account-info__item')}>
                                    <Button primary leftIcon={<FontAwesomeIcon icon={faPen} />}>
                                        <span>Chỉnh sửa thông tin</span>
                                    </Button>
                                </div>
                            </form>
                        </div>
                        <div className="col col-md-3">
                            <div className={cx('account-avatar')}>
                                <div className={cx('account-avatar__current')}>
                                    <img
                                        src="https://via.placeholder.com/150"
                                        alt="Avatar"
                                        className={cx('account-avatar__current-image')}
                                    />
                                </div>
                                <div className={cx('account-avatar__button')}>
                                    <Button primary leftIcon={<FontAwesomeIcon icon={faArrowUpFromBracket} />}>
                                        <span>Chọn ảnh</span>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
