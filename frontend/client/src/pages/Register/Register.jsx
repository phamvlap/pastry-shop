import classNames from 'classnames/bind';

import { Form, InputGroup } from '~/components/index.js';
import styles from '~/pages/Register/Register.module.scss';

const cx = classNames.bind(styles);

const Register = () => {
    return (
        <div className={cx('container')}>
            <Form
                title="Đăng ký tài khoản"
                buttons={[
                    {
                        type: 'primary',
                        onClick: () => {},
                        name: 'Đăng ký',
                    },
                ]}
                onSubmit={() => {}}
                errors={{}}
                className={cx('form-container')}
            >
                <>
                    <InputGroup label="Họ tên" name="customer_name" type="text" onChange={() => {}} errors={{}} />
                    <InputGroup
                        label="Số điện thoại"
                        name="customer_phone_number"
                        type="text"
                        onChange={() => {}}
                        errors={{}}
                    />
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
                </>
            </Form>
        </div>
    );
};

export default Register;
