import { useState, useContext } from 'react';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faArrowUpFromBracket } from '@fortawesome/free-solid-svg-icons';
import FormData from 'form-data';

import { Button, InputItem } from '~/components/index.js';
import UserActions from '~/utils/userActions.js';
import Validator from '~/utils/validator.js';
import registerRules from '~/config/rules/registerRules.js';
import { CustomerService } from '~/services/index.js';
import { UserContext } from '~/contexts/UserContext.jsx';

import styles from '~/pages/UserProfile/UserProfile.module.scss';

const cx = classNames.bind(styles);

const rules = registerRules.filter((rule) => rule.field !== 'customer_password');

const UserProfile = () => {
    const [form, setForm] = useState({
        ...UserActions.getUser(),
    });
    const [errors, setErrors] = useState({});
    const [isUpdating, setIsUpdating] = useState(false);
    const { user, setUser } = useContext(UserContext);
    const [avatar, setAvatar] = useState(null);

    const configApi = {
        headers: {
            'Content-Type': 'multipart/form-data',
            authorization: `Bearer ${UserActions.getToken()}`,
        },
    };

    const currentUser = UserActions.getUser();
    const validator = new Validator(rules);
    const customerService = new CustomerService(configApi);
    const srcAvatar = form.customer_avatar
        ? `${import.meta.env.VITE_UPLOADED_DIR}${form.customer_avatar.image_url.split('/uploads/')[1]}`
        : '';

    const handleOnChange = (event) => {
        if (event.target.type !== 'file') {
            setForm({
                ...form,
                [event.target.name]: event.target.value,
            });
        } else if (event.target.type === 'file') {
            setAvatar(event.target.files[0]);
        }
    };
    const handleTransferUpdate = (event) => {
        event.preventDefault();
        setIsUpdating(!isUpdating);
    };
    const handleUpdate = async (event) => {
        event.preventDefault();

        const newErrors = validator.validate(form);
        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) {
            return;
        }
        const updatable = ['customer_username', 'customer_name', 'customer_phone_number'];
        try {
            let data = {};
            updatable.forEach((key) => {
                if (form[key] !== currentUser[key]) {
                    data[key] = form[key];
                }
            });
            if (Object.keys(data).length === 0) {
                setIsUpdating(false);
                return;
            }
            const response = await customerService.update(data);
            if (response.status === 'success') {
                setIsUpdating(false);
                const profileUser = await customerService.getProfile();
                setUser(profileUser.data);
                UserActions.setUser(profileUser.data);
            }
        } catch (error) {
            setErrors({
                form: 'Tên đăng nhập hoặc mật khẩu không đúng. Vui lòng thử lại',
            });
            setForm({});
        }
    };
    const handleCancel = () => {
        setForm({
            ...currentUser,
        });
        setIsUpdating(false);
    };

    const handleUpdateAvatar = async (event) => {
        event.preventDefault();

        let formData = new FormData();
        formData.append('customer_avatar', avatar);

        const response = await customerService.update(formData);
        if (response.status === 'success') {
            const profileUser = await customerService.getProfile();
            setUser(profileUser.data);
            UserActions.setUser(profileUser.data);
        }
    };
    const handleCancelAvatar = (event) => {
        event.preventDefault();
        setAvatar(null);
    };

    return (
        <div className={cx('container')}>
            <div className={cx('account-wrapper')}>
                <h3 className={cx('account-title')}>Tài khoản của tôi</h3>
                <div className={cx('account-content')}>
                    <div className="row">
                        <div className="col col-md-9">
                            <form className={cx('account-info')}>
                                <div className={cx('account-info__item')}>
                                    <div className={cx('row', 'account-info__item-row')}>
                                        <div className="col col-md-3">
                                            <span className={cx('account-info__label')}>Tên đăng nhập:</span>
                                        </div>
                                        <div className="col col-md-9">
                                            <InputItem
                                                type="text"
                                                name="customer_username"
                                                value={form.customer_username}
                                                error={errors.customer_username}
                                                onChange={(event) => handleOnChange(event)}
                                                className={cx('account-info__value')}
                                                disabled={!isUpdating}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className={cx('account-info__item')}>
                                    <div className={cx('row', 'account-info__item-row')}>
                                        <div className="col col-md-3">
                                            <span className={cx('account-info__label')}>Họ và tên:</span>
                                        </div>
                                        <div className="col col-md-9">
                                            <InputItem
                                                type="text"
                                                name="customer_name"
                                                value={form.customer_name}
                                                error={errors.customer_name}
                                                onChange={(event) => handleOnChange(event)}
                                                className={cx('account-info__value')}
                                                disabled={!isUpdating}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className={cx('account-info__item')}>
                                    <div className={cx('row', 'account-info__item-row')}>
                                        <div className="col col-md-3">
                                            <span className={cx('account-info__label')}>Số điện thoại:</span>
                                        </div>
                                        <div className="col col-md-9">
                                            <InputItem
                                                type="text"
                                                name="customer_phone_number"
                                                value={form.customer_phone_number}
                                                error={errors.customer_phone_number}
                                                onChange={(event) => handleOnChange(event)}
                                                className={cx('account-info__value')}
                                                disabled={!isUpdating}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className={cx('account-info__item')}>
                                    {isUpdating ? (
                                        <>
                                            <Button success onClick={(event) => handleUpdate(event)}>
                                                <span>Lưu thay đổi</span>
                                            </Button>
                                            <Button danger onClick={(event) => handleCancel(event)}>
                                                <span>Hủy</span>
                                            </Button>
                                        </>
                                    ) : (
                                        <Button
                                            primary
                                            leftIcon={<FontAwesomeIcon icon={faPen} />}
                                            onClick={(event) => handleTransferUpdate(event)}
                                        >
                                            <span>Chỉnh sửa thông tin</span>
                                        </Button>
                                    )}
                                </div>
                            </form>
                        </div>
                        <div className="col col-md-3">
                            <form className={cx('account-avatar')}>
                                <div className={cx('account-avatar__current')}>
                                    {avatar ? (
                                        <img
                                            src={URL.createObjectURL(avatar)}
                                            alt="Avatar"
                                            className={cx('account-avatar__current-image')}
                                        />
                                    ) : (
                                        <img
                                            src={srcAvatar}
                                            alt="Avatar"
                                            className={cx('account-avatar__current-image')}
                                        />
                                    )}
                                </div>
                                <InputItem
                                    type="file"
                                    name="customer_avatar"
                                    error={errors.customer_avatar}
                                    onChange={(event) => handleOnChange(event)}
                                    className={cx('account-info__value')}
                                />
                                <div className={cx('account-avatar__button')}>
                                    <Button success onClick={(event) => handleUpdateAvatar(event)}>
                                        <span>Lưu</span>
                                    </Button>
                                    <Button danger onClick={(event) => handleCancelAvatar(event)}>
                                        <span> Hủy</span>
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
