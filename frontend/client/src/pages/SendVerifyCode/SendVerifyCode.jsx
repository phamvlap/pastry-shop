import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';

import { Form, InputGroup, Button } from '~/components/index.js';
import { AccountService } from '~/services/index.js';
import UserActions from '~/utils/userActions.js';
import routes from '~/config/routes.js';

import styles from './SendVerifyCode.module.scss';

const cx = classNames.bind(styles);
const configApi = {
    headers: {
        Authorization: `Bearer ${UserActions.getToken()}`,
    },
};

const SendVerifyCode = () => {
    const [form, setForm] = useState({});
    const [errors, setErrors] = useState({});
    const [successMsg, setSuccessMsg] = useState('');

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
        if (form.email === '' || form.email === undefined) {
            errors.email = 'Email không được để trống';
        }
        if (Object.values(errors).filter((error) => error !== '').length > 0) {
            setErrors(errors);
            return;
        }
        try {
            const accountService = new AccountService(configApi);
            const response = await accountService.sendCode({
                account_username: location.state.account_username,
                account_role: location.state.account_role,
                email: form.email,
            });
            if (response.status === 'success') {
                setSuccessMsg('Mã xác thực đã được gửi đến email của bạn. Vui lòng kiểm tra email.');
                toast.success('Mã xác thực đã được thành công', {
                    onClose: () => {
                        navigate(routes.verifyCode, {
                            state: {
                                account_username: location.state.account_username,
                                account_role: location.state.account_role,
                            },
                        });
                    },
                });
            } else {
                setErrors({
                    email: 'Email không tồn tại.',
                });
            }
        } catch (error) {
            console.log(error);
            setErrors({
                email: 'Email không tồn tại.',
            });
        }
    };
    return (
        <div className={cx('container')}>
            <div className={cx('form-container')}>
                <div className={cx('back-btn-section')}>
                    <Button to={routes.forgotPassword} link className={cx('back-btn')}>
                        <FontAwesomeIcon icon={faChevronLeft} />
                        <span className="ms-1">Quay lại</span>
                    </Button>
                </div>
                <Form
                    title="Khôi phục mật khẩu"
                    buttons={[
                        {
                            type: 'primary',
                            name: 'Tiếp tục',
                        },
                    ]}
                    onSubmit={(event) => handleOnSubmit(event)}
                    errors={errors}
                    className={cx('form-content')}
                >
                    <div className={cx('success-msg')}>{successMsg}</div>
                    <InputGroup
                        label="Email nhận mã xác thực"
                        name="email"
                        type="email"
                        onChange={(event) => handleOnChange(event)}
                        value={form.email}
                        error={errors.email}
                    />
                </Form>
            </div>
        </div>
    );
};

export default SendVerifyCode;
