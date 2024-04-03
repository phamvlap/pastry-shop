import classNames from 'classnames/bind';
import { Link } from 'react-router-dom';

import { Form, InputGroup } from '~/components/index.js';
import styles from '~/pages/Login/Login.module.scss';

const cx = classNames.bind(styles);

const Login = () => {
    return (
        <div className={cx('container')}>
            <Form
                title="Đăng nhập"
                buttons={[
                    {
                        type: 'primary',
                        onClick: () => {},
                        name: 'Đăng nhập',
                    },
                ]}
                onSubmit={() => {}}
                errors={{}}
                className={cx('form-container')}
            >
                <>
                    <InputGroup
                        label="Tên đăng nhập"
                        name="customer_username"
                        type="text"
                        onChange={() => {}}
                        errors={{}}
                    />
                    <InputGroup
                        label="Mật khẩu"
                        name="customer_password"
                        type="password"
                        onChange={() => {}}
                        errors={{}}
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
