import { useState } from 'react';
import classNames from 'classnames/bind';

import { Button, InputGroup } from '~/components/index.js';
import UserActions from '~/utils/userActions.js';
import { AccountService } from '~/services/index.js';
import passwordRules from '~/config/rules/passwordRules.js';
import Validator from '~/utils/validator.js';

import styles from '~/pages/UserPassword/UserPassword.module.scss';

const cx = classNames.bind(styles);

const UserPassword = () => {
    const [form, setForm] = useState({});
    const [errors, setErrors] = useState({});

    const configApi = {
        headers: {
            authorization: `Bearer ${UserActions.getToken()}`,
        },
    };
    const accountService = new AccountService(configApi);
    const user = UserActions.getUser();
    const validator = new Validator(passwordRules);

    const handleOnChange = (event) => {
        setForm({
            ...form,
            [event.target.name]: event.target.value,
        });
    };
    const handleOnSubmit = async (event) => {
        event.preventDefault();
        try {
            const newErrors = validator.validate(form);
            if (form.new_password !== form.confirm_password) {
                newErrors.confirm_password = 'Mật khẩu xác nhận không khớp';
            }
            console.log(newErrors);
            if (Object.keys(newErrors).length > 0) {
                setErrors(newErrors);
                return;
            }
            const response = await accountService.changePassword(
                user.account_id,
                form.cur_password,
                form.new_password,
                form.confirm_password,
            );
            if (response.status === 'success') {
                setForm({});
                setErrors({});
                alert('Đổi mật khẩu thành công');
            }
        } catch (error) {
            const code = error.response.data.msg.split(':')[0];
            const newErrors = {};
            if (code === 'NOTMATCH') {
                newErrors.cur_password = 'Mật khẩu hiện tại không đúng';
            }
            if (code === 'INVALID') {
                newErrors.new_password = 'Mật khẩu mới không hợp lệ';
            }
            setErrors(newErrors);
        }
    };
    const handleOnCancel = (event) => {
        event.preventDefault();
        setForm({});
        setErrors({});
    };
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
                                        <InputGroup
                                            type="password"
                                            name="cur_password"
                                            value={form.cur_password}
                                            error={errors.cur_password}
                                            onChange={(event) => handleOnChange(event)}
                                            className={cx('change-password-info__value')}
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
                                        <InputGroup
                                            type="password"
                                            name="new_password"
                                            value={form.new_password}
                                            error={errors.new_password}
                                            onChange={(event) => handleOnChange(event)}
                                            className={cx('change-password-info__value')}
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
                                        <InputGroup
                                            type="password"
                                            name="confirm_password"
                                            value={form.confirm_password}
                                            error={errors.confirm_password}
                                            onChange={(event) => handleOnChange(event)}
                                            className={cx('change-password-info__value')}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className={cx('change-password-info__item')}>
                                <Button success onClick={(event) => handleOnSubmit(event)}>
                                    <span>Lưu</span>
                                </Button>
                                <Button danger onClick={(event) => handleOnCancel(event)}>
                                    <span>Hủy</span>
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
