import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';

import { Form, InputGroup, Button } from '~/components/index.js';
import { AccountService } from '~/services/index.js';
import UserActions from '~/utils/userActions.js';
import routes from '~/config/routes.js';

import styles from './ForgotPassword.module.scss';

const cx = classNames.bind(styles);
const configApi = {
    headers: {
        Authorization: `Bearer ${UserActions.getToken()}`,
    },
};

const ForgotPassword = () => {
    const [form, setForm] = useState({});
    const [errors, setErrors] = useState({});

    const navigate = useNavigate();

    const handleOnChange = (event) => {
        setForm({
            ...form,
            [event.target.name]: event.target.value,
        });
    };
    const handleOnSubmit = async (event) => {
        event.preventDefault();
        const errors = {};
        if (form.customer_username === '' || form.customer_username === undefined) {
            errors.customer_username = 'Tên đăng nhập không được để trống';
        }
        if (Object.values(errors).filter((error) => error !== '').length > 0) {
            setErrors(errors);
            return;
        }
        try {
            const accountService = new AccountService(configApi);
            const response = await accountService.forgotPassword({
                account_username: form.customer_username,
                account_role: 'customer',
            });
            if (response.status === 'success') {
                navigate(routes.sendVerifyCode, {
                    state: {
                        account_username: form.customer_username,
                        account_role: 'customer',
                    },
                });
            } else {
                setErrors({
                    customer_username: 'Tên đăng nhập không tồn tại.',
                });
            }
        } catch (error) {
            console.log(error);
            setErrors({
                customer_username: 'Tên đăng nhập không tồn tại.',
            });
        }
    };
    return (
        <div className={cx('container')}>
            <div className={cx('form-container')}>
                <div className={cx('back-btn-section')}>
                    <Button to={routes.login} link className={cx('back-btn')}>
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
                    <>
                        <InputGroup
                            label="Tên đăng nhập của bạn"
                            name="customer_username"
                            type="text"
                            onChange={(event) => handleOnChange(event)}
                            value={form.customer_username}
                            error={errors.customer_username}
                        />
                    </>
                </Form>
            </div>
        </div>
    );
};

export default ForgotPassword;
