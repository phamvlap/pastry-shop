import { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import classNames from 'classnames/bind';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';

import { Form, InputGroup, Modal, Button } from '~/components/index.js';
import addressRules from '~/config/rules/addressRules.js';
import Validator from '~/utils/validator.js';
import addressActions from '~/utils/addressActions.js';
import routes from '~/config/routes.js';

import styles from './UserAddressAdd.module.scss';

const cx = classNames.bind(styles);

const UserAddressAdd = () => {
    const [form, setForm] = useState({});
    const [errors, setErrors] = useState({});
    const [isUpdating, setIsUpdating] = useState(false);

    const validator = new Validator(addressRules);
    const navigate = useNavigate();
    const location = useLocation();
    const openBtnRef = useRef(null);
    const closeBtnRef = useRef(null);

    const fetchAddresses = async () => {
        try {
            const response = await addressActions.getAddresses();
            if (response.status === 'success') {
                return response.data;
            } else {
                return [];
            }
        } catch (error) {
            console.log(error);
        }
    };
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
                const addresses = await fetchAddresses();
                if (addresses.length === 0) {
                    form.address_is_default = true;
                }
                response = await addressActions.addAddress({
                    ...form,
                    address_is_default: Number(form.address_is_default),
                });
            }
            if (response.status !== 'success') {
                throw new Error('Invalid credentials');
            }
            const message = `${isUpdating ? 'Cập nhật' : 'Thêm mới'} địa chỉ thành công`;
            const duration = 3000;
            const from = location.state?.from || routes.userAddress;
            toast.success(message, {
                autoClose: duration,
                onClose: () => {
                    if (from === routes.userAddress) {
                        navigate(from);
                    } else {
                        navigate(from, {
                            state: {
                                state: {
                                    ...location.state.state,
                                    address: {
                                        ...response.data,
                                    },
                                },
                            },
                        });
                    }
                },
            });
        } catch (error) {
            console.log(error);
            const message = error.response?.data?.message || 'Có lỗi xảy ra';
            toast.error(message);
        }
    };
    const confirmCancel = (event) => {
        event.preventDefault();
        openBtnRef.current.click();
    };
    const cancelUpdateAddress = () => {
        closeBtnRef.current.click();
        navigate(routes.userAddress);
    };
    useEffect(() => {
        if (location.state?.address) {
            setForm(location.state.address);
            setIsUpdating(true);
        }
    }, []);

    return (
        <div className={cx('address-wrapper')}>
            <div className={cx('address-title')}>
                <div className={cx('address-back')}>
                    <Button to={routes.userAddress} link>
                        <FontAwesomeIcon icon={faChevronLeft} />
                        <span className="d-inline-block ms-1">Quay lại</span>
                    </Button>
                </div>
                {!isUpdating ? <span>Thêm địa chỉ mới</span> : <span>Cập nhật địa chỉ</span>}
            </div>
            <div className={cx('address-content')}>
                <div className={cx('address-add-form')}>
                    <Form
                        buttons={[
                            {
                                type: 'secondary',
                                name: 'Hủy',
                                onClick: (event) => confirmCancel(event),
                            },
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

            <button ref={openBtnRef} data-bs-toggle="modal" data-bs-target="#update-address-modal"></button>
            <Modal
                id="update-address-modal"
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
                        onClick: () => cancelUpdateAddress(),
                    },
                ]}
            >
                <p>Bạn có chắc chắn muốn hủy bỏ việc {isUpdating ? 'cập nhật' : 'thêm mới'} địa chỉ này không?</p>
            </Modal>
        </div>
    );
};

export default UserAddressAdd;
