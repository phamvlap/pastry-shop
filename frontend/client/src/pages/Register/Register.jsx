import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames/bind';
import { toast } from 'react-toastify';

import { Form, InputGroup } from '~/components/index.js';
import registerRules from '~/config/rules/registerRules.js';
import Validator from '~/utils/validator.js';
import { CustomerService } from '~/services/index.js';
import routes from '~/config/routes.js';

import styles from './Register.module.scss';

const cx = classNames.bind(styles);

const Register = () => {
    const [form, setForm] = useState({});
    const [errors, setErrors] = useState({});

    const validator = new Validator(registerRules);
    const customerService = new CustomerService();
    const navigate = useNavigate();

    const handleOnChange = (event) => {
        setForm({
            ...form,
            [event.target.name]: event.target.value,
        });
    };
    const handleOnSubmit = async (event) => {
        event.preventDefault();

        let newErrors = validator.validate(form);
        if (form.customer_password !== form.customer_confirm_password) {
            newErrors.customer_confirm_password = 'Nhập lại mật khẩu không khớp';
        }
        if (Object.values(newErrors).filter((value) => value !== '').length > 0) {
            setErrors(newErrors);
            return;
        }
        try {
            const response = await customerService.register(form);
            if (response.status === 'success') {
                toast.success('Đăng ký tài khoản thành công', {
                    duration: 1000,
                    onClose: () => {
                        const user = response.data;
                        setForm({});
                        setErrors({});
                        navigate(routes.login, {
                            state: {
                                newUser: user,
                            },
                        });
                    },
                });
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div>
            <div className={cx('container')}>
                <Form
                    title="Đăng ký tài khoản"
                    buttons={[
                        {
                            type: 'primary',
                            name: 'Đăng ký',
                        },
                    ]}
                    onSubmit={(event) => handleOnSubmit(event)}
                    errors={errors}
                    className={cx('form-container')}
                >
                    <>
                        <InputGroup
                            label="Họ tên"
                            name="customer_name"
                            type="text"
                            onChange={(event) => handleOnChange(event)}
                            value={form.customer_name}
                            error={errors.customer_name}
                        />
                        <InputGroup
                            label="Số điện thoại"
                            name="customer_phone_number"
                            type="text"
                            onChange={(event) => handleOnChange(event)}
                            value={form.customer_phone_number}
                            error={errors.customer_phone_number}
                        />
                        <InputGroup
                            label="Tên đăng nhập"
                            name="customer_username"
                            type="text"
                            onChange={(event) => handleOnChange(event)}
                            value={form.customer_username}
                            error={errors.customer_username}
                        />
                        <InputGroup
                            label="Mật khẩu"
                            name="customer_password"
                            type="password"
                            onChange={(event) => handleOnChange(event)}
                            value={form.customer_password}
                            error={errors.customer_password}
                        />
                        <InputGroup
                            label="Nhập lại mật khẩu"
                            name="customer_confirm_password"
                            type="password"
                            onChange={(event) => handleOnChange(event)}
                            value={form.customer_confirm_password}
                            error={errors.customer_confirm_password}
                        />
                    </>
                </Form>
            </div>
        </div>
    );
};

export default Register;
