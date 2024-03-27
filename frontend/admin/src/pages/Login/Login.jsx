import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames/bind';

import { StaffContext } from '~/contexts/StaffContext.jsx';
import { staffActions, Validator } from '~/utils/index.js';
import { InputGroup, Form } from '~/components/index.js';
import loginRules from '~/config/rules/login.js';

import styles from '~/pages/Login/Login.module.scss';

const cx = classNames.bind(styles);

const Login = () => {
    const [form, setForm] = useState({
        email: '',
        password: '',
    });
    const [errors, setErrors] = useState({});
    const { setStaff, token, setToken, isAuthenticated, setIsAuthenticated } = useContext(StaffContext);

    const navigate = useNavigate();
    const validator = new Validator(loginRules);

    const handleFormChange = (event) => {
        const newForm = { ...form, [event.target.name]: event.target.value };
        setForm(newForm);
    };
    const handleSubmitForm = async (event) => {
        event.preventDefault();

        const newErrors = validator.validate(form);
        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) {
            return;
        }
        try {
            const data = await staffActions.logIn(form.email, form.password);
            if (!data) {
                setErrors({
                    form: 'Email hoặc mật khẩu không chính xác. Vui lòng thử lại.',
                });
                setForm({
                    email: '',
                    password: '',
                });
            }
            const { staff, token } = data;
            setStaff(staff);
            setToken(token);
            setIsAuthenticated(true);
            navigate('/');
        } catch (error) {
            setErrors({
                form: 'Email hoặc mật khẩu không chính xác. Vui lòng thử lại.',
            });
            setForm({
                email: '',
                password: '',
            });
            return;
        }
    };

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/');
        }
    });

    return (
        <div className={cx('container')}>
            <div>
                <Form
                    title="Đăng nhập"
                    onSubmit={handleSubmitForm}
                    errors={errors}
                    buttons={[
                        {
                            type: 'primary',
                            name: 'Đăng nhập',
                        },
                    ]}
                >
                    <>
                        <InputGroup
                            type="email"
                            label="Email"
                            name="email"
                            value={form.email}
                            onChange={handleFormChange}
                            error={errors.email}
                        />
                        <InputGroup
                            type="password"
                            label="Password"
                            name="password"
                            value={form.password}
                            onChange={handleFormChange}
                            error={errors.password}
                        />
                        <div className={cx('forget-password')}>
                            <span className={cx('forget-password__title')}>Quên mật khâu ?</span>
                        </div>
                    </>
                </Form>
            </div>
        </div>
    );
};

export default Login;
