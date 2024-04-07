import { useState } from 'react';
import classNames from 'classnames/bind';
import { useNavigate } from 'react-router-dom';

import { Form, InputGroup } from '~/components/index.js';
import registerRules from '~/config/rules/registerRules.js';
import Validator from '~/utils/validator.js';
import { CustomerService } from '~/services/index.js';

import styles from '~/pages/Register/Register.module.scss';

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

        const newErrors = validator.validate(form);
        console.log(newErrors);
        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) {
            return;
        }
        try {
            const response = await customerService.register(form);
            if (response.status !== 'success') {
                throw new Error('Invalid credentials');
            }
            const user = response.data;
            navigate('/login', {
                state: {
                    newUser: user,
                },
            });
        } catch (error) {
            console.log(error);
        }
    };

    return (
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
                </>
            </Form>
        </div>
    );
};

export default Register;
