import { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import { useNavigate, useLocation } from 'react-router-dom';

import { Form, InputGroup } from '~/components/index.js';
import addressRules from '~/config/rules/addressRules.js';
import Validator from '~/utils/validator.js';
import addressActions from '~/utils/addressActions.js';

import styles from '~/pages/UserAddressAdd/UserAddressAdd.module.scss';

const cx = classNames.bind(styles);

const UserAddressAdd = () => {
    const [form, setForm] = useState({});
    const [errors, setErrors] = useState({});
    const [isUpdating, setIsUpdating] = useState(false);

    const validator = new Validator(addressRules);
    const navigate = useNavigate();
    const location = useLocation();

    const handleOnChange = (event) => {
        if (event.target.type === 'checkbox') {
            setForm({
                ...form,
                [event.target.name]: event.target.checked,
            });
            return;
        }
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
            if (!form.address_is_default) {
                form.address_is_default = false;
            }
            let response = null;
            if (form.address_id) {
                response = await addressActions.updateAddress(form.address_id, {
                    ...form,
                    address_is_default: Number(form.address_is_default),
                });
            } else {
                response = await addressActions.addAddress({
                    ...form,
                    address_is_default: Number(form.address_is_default),
                });
            }
            if (response.status !== 'success') {
                throw new Error('Invalid credentials');
            }
            navigate('/user/address');
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        if (location.state) {
            setForm(location.state.address);
            setIsUpdating(true);
        }
    }, []);

    return (
        <div className={cx('address-wrapper')}>
            <h3 className={cx('address-title')}>
                {!isUpdating ? <span>Thêm địa chỉ mới</span> : <span>Cập nhật địa chỉ</span>}
            </h3>
            <div className={cx('address-content')}>
                <div className={cx('address-add-form')}>
                    <Form
                        buttons={[
                            {
                                type: 'primary',
                                name: isUpdating ? 'Cập nhật' : 'Thêm mới',
                            },
                        ]}
                        onSubmit={(event) => handleOnSubmit(event)}
                        errors={errors}
                        className={cx('form-container')}
                    >
                        <>
                            <InputGroup
                                label="Tên đầy đủ"
                                name="address_fullname"
                                type="text"
                                onChange={(event) => handleOnChange(event)}
                                value={form.address_fullname}
                                error={errors.address_fullname}
                            />
                            <InputGroup
                                label="Số điện thoại"
                                name="address_phone_number"
                                type="text"
                                onChange={(event) => handleOnChange(event)}
                                value={form.address_phone_number}
                                error={errors.address_phone_number}
                            />
                            <InputGroup
                                label="Địa chỉ"
                                name="address_detail"
                                type="textarea"
                                rows={4}
                                onChange={(event) => handleOnChange(event)}
                                value={form.address_detail}
                                error={errors.address_detail}
                            />
                            <InputGroup
                                label="Đặt làm mặc định"
                                name="address_is_default"
                                type="checkbox"
                                onChange={(event) => handleOnChange(event)}
                                checked={!!form.address_is_default}
                            />
                        </>
                    </Form>
                </div>
            </div>
        </div>
    );
};

export default UserAddressAdd;
