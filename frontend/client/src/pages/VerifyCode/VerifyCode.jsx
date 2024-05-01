import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';

import { Form, InputGroup, Button } from '~/components/index.js';
import { AccountService } from '~/services/index.js';
import UserActions from '~/utils/userActions.js';
import routes from '~/config/routes.js';

import styles from './VerifyCode.module.scss';

const cx = classNames.bind(styles);
const configApi = {
    headers: {
        Authorization: `Bearer ${UserActions.getToken()}`,
    },
};

const VerifyCode = () => {
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
        if (form.code === '' || form.code === undefined) {
            errors.code = 'Mã xác thực không được để trống';
        }
        if (Object.values(errors).filter((error) => error !== '').length > 0) {
            setErrors(errors);
            return;
        }
        try {
            const accountService = new AccountService(configApi);
            const response = await accountService.verifyCode({
                account_username: location.state.account_username,
                account_role: location.state.account_role,
                code: form.code,
            });
            if (response.status === 'success') {
                navigate(routes.resetPassword, {
                    state: {
                        account_username: location.state.account_username,
                        account_role: location.state.account_role,
                    },
                });
            } else {
                setErrors({
                    code: 'Mã xác thực không đúng.',
                });
            }
        } catch (error) {
            console.log(error);
            setErrors({
                code: 'Mã xác thực không đúng.',
            });
        }
    };
    return (
        <div className={cx('container')}>
            <div className={cx('form-container')}>
                <div className={cx('back-btn-section')}>
                    <Button to={routes.sendVerifyCode} link className={cx('back-btn')}>
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
                            label="Mã xác thực của bạn"
                            name="code"
                            type="text"
                            onChange={(event) => handleOnChange(event)}
                            value={form.code}
                            error={errors.code}
                        />
                    </>
                </Form>
            </div>
        </div>
    );
};

export default VerifyCode;
