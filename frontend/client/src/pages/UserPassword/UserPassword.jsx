import { useContext } from 'react';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen } from '@fortawesome/free-solid-svg-icons';

import { Button, InputItem } from '~/components/index.js';
import { UserContext } from '~/contexts/UserContext.jsx';
import styles from '~/pages/UserPassword/UserPassword.module.scss';

const cx = classNames.bind(styles);

const UserPassword = () => {
    const { user } = useContext(UserContext);
    console.log(user);
    return (
        <div className={cx('change-password-wrapper')}>
            <h3 className={cx('change-password-title')}>Đổi mật khẩu</h3>
            <div className={cx('change-password-content')}>
                <div className="row">
                    <div className="col col-md-8 offset-md-2">
                        <form className={cx('change-password-info')}>
                            <div className={cx('change-password-info__item')}>
                                <div className={cx('row', 'change-password-info__item-row')}>
                                    <div className="col col-md-4">
                                        <span className={cx('change-password-info__label')}>Mật khẩu hiện tại:</span>
                                    </div>
                                    <div className="col col-md-8">
                                        <InputItem
                                            type="password"
                                            name="customer_username"
                                            value="nguyena"
                                            className={cx('change-password-info__value')}
                                            disabled
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className={cx('change-password-info__item')}>
                                <div className={cx('row', 'change-password-info__item-row')}>
                                    <div className="col col-md-4">
                                        <span className={cx('change-password-info__label')}>Mật khẩu mới:</span>
                                    </div>
                                    <div className="col col-md-8">
                                        <InputItem
                                            type="password"
                                            name="customer_username"
                                            value="nguyena"
                                            className={cx('change-password-info__value')}
                                            disabled
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className={cx('change-password-info__item')}>
                                <div className={cx('row', 'change-password-info__item-row')}>
                                    <div className="col col-md-4">
                                        <span className={cx('change-password-info__label')}>
                                            Nhập lại mật khẩu mới:
                                        </span>
                                    </div>
                                    <div className="col col-md-8">
                                        <InputItem
                                            type="password"
                                            name="customer_username"
                                            value="nguyena"
                                            className={cx('change-password-info__value')}
                                            disabled
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className={cx('change-password-info__item')}>
                                <Button primary leftIcon={<FontAwesomeIcon icon={faPen} />}>
                                    <span>Đổi mật khẩu</span>
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserPassword;
