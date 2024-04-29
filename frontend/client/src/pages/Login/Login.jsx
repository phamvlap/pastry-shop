import { useState, useContext, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import classNames from 'classnames/bind';
import { toast } from 'react-toastify';

import { Form, InputGroup } from '~/components/index.js';
import { UserContext } from '~/contexts/UserContext.jsx';
import Validator from '~/utils/validator.js';
import UserActions from '~/utils/userActions.js';
import loginRules from '~/config/rules/loginRules.js';
import routes from '~/config/routes.js';

import styles from './Login.module.scss';

const cx = classNames.bind(styles);

const Login = () => {
    const [form, setForm] = useState({
        customer_username: '',
        customer_password: '',
    });
    const [errors, setErrors] = useState({
        customer_username: '',
        customer_password: '',
        form: '',
    });
    const { setUser, setToken, isLogged, setIsLogged } = useContext(UserContext);

    const validator = new Validator(loginRules);
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/';

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
        if (Object.values(newErrors).filter((value) => value !== '').length > 0) {
            return;
        }
        try {
            const data = await UserActions.login(form.customer_username, form.customer_password);
            if (!data) {
                setErrors({
                    form: 'Tên đăng nhập hoặc mật khẩu không đúng. Vui lòng thử lại',
                });
                setForm({});
                return;
            }
            toast.success('Đăng nhập thành công', {
                duration: 1000,
                onClose: () => {
                    setForm({});
                    setErrors({});
                    setUser(data.user);
                    setToken(data.token);
                    setIsLogged(true);
                    navigate(from, {
                        replace: true,
                    });
                },
            });
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
            navigate(from, {
                replace: true,
            });
        }
        if (location.state?.newUser) {
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
                        <Link to={routes.register} className={cx('form-item__link-register')}>
                            Đăng ký
                        </Link>
                    </div>
                </>
            </Form>
        </div>
    );
};

export default Login;
