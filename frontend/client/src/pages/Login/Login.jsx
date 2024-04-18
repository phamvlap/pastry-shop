import { useState, useContext, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import classNames from 'classnames/bind';

import { Form, InputGroup } from '~/components/index.js';
import styles from './Login.module.scss';

import { UserContext } from '~/contexts/UserContext.jsx';
import Validator from '~/utils/validator.js';
import UserActions from '~/utils/userActions.js';
import loginRules from '~/config/rules/loginRules.js';

const cx = classNames.bind(styles);

const Login = () => {
    const [form, setForm] = useState({});
    const [errors, setErrors] = useState({});
    const { user, setUser, token, setToken, isLogged, setIsLogged } = useContext(UserContext);

    const validator = new Validator(loginRules);
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

        const newErrors = validator.validate(form);
        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) {
            return;
        }
        try {
            const data = await UserActions.login(form.customer_username, form.customer_password);
            if (!data) {
                setErrors({
                    form: 'Tên đăng nhập hoặc mật khẩu không đúng. Vui lòng thử lại',
                });
                setForm({});
            }
            setUser(data.user);
            setToken(data.token);
            setIsLogged(true);
            navigate('/');
        } catch (error) {
            console.log(error.message);
            setErrors({
                form: 'Tên đăng nhập hoặc mật khẩu không đúng. Vui lòng thử lại',
            });
            setForm({});
        }
    };

    useEffect(() => {
        if (isLogged) {
            navigate('/');
        }
        if (location.state) {
            setForm({
                customer_username: location.state.newUser.customer_username,
            });
        }
    }, []);

    return (
        <div className={cx('container')}>
            <Form
                title="Đăng nhập"
                buttons={[
                    {
                        type: 'primary',
                        name: 'Đăng nhập',
                    },
                ]}
                onSubmit={(event) => handleOnSubmit(event)}
                errors={errors}
                className={cx('form-container')}
            >
                <>
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
                    <div className={cx('form-item__forget-password')}>Quên mật khẩu?</div>
                    <div className={cx('form-item__direct-register')}>
                        Bạn chưa có tài khoản?
                        <Link to="/register" className={cx('form-item__link-register')}>
                            Đăng ký
                        </Link>
                    </div>
                </>
            </Form>
        </div>
    );
};

export default Login;
