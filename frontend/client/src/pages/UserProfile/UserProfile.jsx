import { useState, useContext, useRef } from 'react';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import FormData from 'form-data';
import { toast } from 'react-toastify';

import { Button, InputGroup, Modal } from '~/components/index.js';
import UserActions from '~/utils/userActions.js';
import Validator from '~/utils/validator.js';
import Helper from '~/utils/helper.js';
import registerRules from '~/config/rules/registerRules.js';
import { CustomerService } from '~/services/index.js';
import { UserContext } from '~/contexts/UserContext.jsx';

import styles from './UserProfile.module.scss';

const cx = classNames.bind(styles);

const rules = registerRules.filter(
    (rule) => rule.field !== 'customer_password' && rule.field !== 'customer_confirm_password',
);

const UserProfile = () => {
    const [form, setForm] = useState({
        ...UserActions.getUser(),
    });
    const [errors, setErrors] = useState({});
    const [isUpdating, setIsUpdating] = useState(false);
    const [avatar, setAvatar] = useState(null);
    const [isShowSaveBtn, setIsShowSaveBtn] = useState(false);
    const [isUpdateAvatar, setIsUpdateAvatar] = useState(false);

    const { user, setUser } = useContext(UserContext);
    const openBtnRef = useRef();
    const closeBtnRef = useRef();

    const configApi = {
        headers: {
            'Content-Type': 'multipart/form-data',
            authorization: `Bearer ${UserActions.getToken()}`,
        },
    };

    const currentUser = UserActions.getUser();
    const validator = new Validator(rules);
    const customerService = new CustomerService(configApi);
    const srcAvatar = Helper.formatImageUrl(currentUser.customer_avatar.image_url);

    const handleOnChange = (event) => {
        if (event.target.type !== 'file') {
            setForm({
                ...form,
                [event.target.name]: event.target.value,
            });
        } else if (event.target.type === 'file') {
            setAvatar(event.target.files[0]);
            setIsShowSaveBtn(true);
        }
        setErrors({});
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
                toast.info('Không có thông tin nào thay đổi');
                setIsUpdating(false);
                return;
            }
            const response = await customerService.update(data);
            if (response.status === 'success') {
                toast.success('Cập nhật thông tin thành công');
                setIsUpdating(false);
                const profileUser = await customerService.getProfile();
                const newInfo = {
                    ...user,
                    ...profileUser.data,
                };
                setUser(newInfo);
                UserActions.setUser(newInfo);
            }
        } catch (error) {
            setErrors({
                form: 'Tên đăng nhập hoặc mật khẩu không đúng. Vui lòng thử lại',
            });
            setForm({});
        }
    };
    const confirmCancel = (event) => {
        event.preventDefault();
        openBtnRef.current.click();
    };
    const cancelUpdating = () => {
        setForm({
            ...currentUser,
        });
        setIsUpdating(false);
        closeBtnRef.current.click();
    };

    const handleUpdateAvatar = async (event) => {
        event.preventDefault();
        setIsUpdateAvatar(true);

        let formData = new FormData();
        formData.append('customer_avatar', avatar);

        const response = await customerService.update(formData);
        if (response.status === 'success') {
            toast.success('Cập nhật ảnh đại diện thành công');
            const profileUser = await customerService.getProfile();
            const newInfo = {
                ...user,
                ...profileUser.data,
            };
            setUser(newInfo);
            UserActions.setUser(newInfo);
            setAvatar(null);
            setIsShowSaveBtn(false);
            setIsUpdateAvatar(false);
        }
    };
    const confirmCancelAvatar = (event) => {
        event.preventDefault();
        if (avatar) {
            openBtnRef.current.click();
            setIsUpdateAvatar(true);
        }
    };
    const cancelUpdateAvatar = () => {
        setAvatar(null);
        setIsShowSaveBtn(false);
        setIsUpdateAvatar(false);
        closeBtnRef.current.click();
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
                                            <InputGroup
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
                                            <InputGroup
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
                                            <InputGroup
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
                                            <Button danger onClick={(event) => confirmCancel(event)}>
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
                                <div className={cx('account-avatar__input')}>
                                    <input
                                        type="file"
                                        name="customer_avatar"
                                        id="customer_avatar"
                                        onChange={(event) => handleOnChange(event)}
                                        className={cx('account-info__value')}
                                        hidden
                                    />
                                    <label htmlFor="customer_avatar" className={cx('account-info__value-label')}>
                                        Chọn ảnh
                                    </label>
                                </div>
                                {isShowSaveBtn && (
                                    <div className={cx('account-avatar__button')}>
                                        <Button success onClick={(event) => handleUpdateAvatar(event)}>
                                            <span>Lưu</span>
                                        </Button>
                                        <Button danger onClick={(event) => confirmCancelAvatar(event)}>
                                            <span> Hủy</span>
                                        </Button>
                                    </div>
                                )}
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            <button ref={openBtnRef} data-bs-toggle="modal" data-bs-target="#update-user-modal"></button>
            <Modal
                id="update-user-modal"
                title="Xác nhận"
                buttons={[
                    {
                        type: 'secondary',
                        dismiss: 'modal',
                        text: 'Đóng',
                        ref: closeBtnRef,
                    },
                    {
                        type: 'primary',
                        text: 'Đồng ý',
                        onClick: !isUpdateAvatar ? () => cancelUpdating() : () => cancelUpdateAvatar(),
                    },
                ]}
            >
                <p>
                    {!isUpdateAvatar
                        ? 'Bạn có chắc chắn muốn hủy bỏ việc chỉnh sửa thông tin cá nhân không? Mọi thay đổi chưa lưu sẽ bị mất.'
                        : 'Bạn có chắc chắn muốn hủy bỏ việc cập nhật ảnh đại diện không?'}
                </p>
            </Modal>
        </div>
    );
};

export default UserProfile;
