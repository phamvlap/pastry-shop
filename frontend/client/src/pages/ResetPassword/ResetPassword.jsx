import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import classNames from 'classnames/bind';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';

import { Form, InputGroup, Button } from '~/components/index.js';
import { AccountService } from '~/services/index.js';
import UserActions from '~/utils/userActions.js';
import routes from '~/config/routes.js';
import Validator from '~/utils/validator.js';

import styles from './ResetPassword.module.scss';

const cx = classNames.bind(styles);
const configApi = {
    headers: {
        Authorization: `Bearer ${UserActions.getToken()}`,
    },
};

const ResetPassword = () => {
    const [form, setForm] = useState({});
    const [errors, setErrors] = useState({});

    const navigate = useNavigate();
    const location = useLocation();

    const handleOnChange = (event) => {
        setForm({
            ...form,
            [event.target.name]: event.target.value,
        });
    };
    const handleOnSubmit = async (event) => {
        event.preventDefault();
        const errors = {};
        if (form.account_password === '' || form.account_password === undefined) {
            errors.account_password = 'Mật khẩu không được để trống';
        }
        if (form.account_confirm_password === '' || form.account_confirm_password === undefined) {
            errors.account_confirm_password = 'Nhập lại mật khẩu không được để trống';
        }
        if (!errors.account_password && !Validator.isPassword(form.account_password)) {
            errors.account_password = 'Mật khẩu phải ít nhất 8 ký tư bao gồm chữ số và chữ cái.';
        }
        if (!errors.account_confirm_password && form.account_password !== form.account_confirm_password) {
            errors.account_confirm_password = 'Nhập lại mật khẩu không khớp.';
        }
        if (Object.values(errors).filter((error) => error !== '').length > 0) {
            setErrors(errors);
            return;
        }
        try {
            const accountService = new AccountService(configApi);
            const response = await accountService.resetPassword({
                account_username: location.state.account_username,
                account_role: location.state.account_role,
                account_password: form.account_password,
            });
            if (response.status === 'success') {
                toast.success('Khôi phục mật khẩu thành công.', {
                    onClose: () => {
                        navigate(routes.login);
                    },
                });
            } else {
                setErrors({
                    form: 'Khôi phục mật khẩu không thành công.',
                });
            }
        } catch (error) {
            console.log(error);
            setErrors({
                form: 'Khôi phục mật khẩu không thành công.',
            });
        }
    };
    return (
        <div className={cx('container')}>
            <div className={cx('form-container')}>
                <div className={cx('back-btn-section')}>
                    <Button to={routes.verifyCode} link className={cx('back-btn')}>
                        <FontAwesomeIcon icon={faChevronLeft} />
                        <span className="ms-1">Quay lại</span>
                    </Button>
                </div>
                <Form
                    title="Khôi phục mật khẩu"
                    buttons={[
                        {
                            type: 'primary',
                            name: 'Lưu',
                        },
                    ]}
                    onSubmit={(event) => handleOnSubmit(event)}
                    errors={errors}
                    className={cx('form-content')}
                >
                    <>
                        <InputGroup
                            label="Mật khẩu mới"
                            name="account_password"
                            type="password"
                            onChange={(event) => handleOnChange(event)}
                            value={form.account_password}
                            error={errors.account_password}
                        />
                        <InputGroup
                            label="Nhập lại mật khẩu mới"
                            name="account_confirm_password"
                            type="password"
                            onChange={(event) => handleOnChange(event)}
                            value={form.account_confirm_password}
                            error={errors.account_confirm_password}
                        />
                    </>
                </Form>
            </div>
        </div>
    );
};

export default ResetPassword;
