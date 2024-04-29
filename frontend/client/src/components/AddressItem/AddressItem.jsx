import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';

import { Button, Modal } from '~/components/index.js';
import AddressActions from '~/utils/addressActions.js';
import routes from '~/config/routes.js';

import styles from './AddressItem.module.scss';

const cx = classNames.bind(styles);

const AddressItem = ({ address, setAddressList }) => {
    const navigate = useNavigate();
    const openBtnRef = useRef(null);
    const closeBtnRef = useRef(null);

    const handleSetDefault = async () => {
        try {
            const response = await AddressActions.setDefaultAddress(address.address_id);

            if (response.status !== 'success') {
                return;
            }
            setAddressList((prevList) => {
                return prevList.map((item) => {
                    if (item.address_id === address.address_id) {
                        return {
                            ...item,
                            address_is_default: 1,
                        };
                    }
                    return {
                        ...item,
                        address_is_default: 0,
                    };
                });
            });
            toast.success('Đã thiết lập địa chỉ mặc định mới.');
        } catch (e) {
            toast.error(e.message);
        }
    };
    const transferToUpdate = () => {
        navigate(routes.userAddressAdd, {
            state: {
                address,
            },
        });
    };
    const confirmDeleteAddress = () => {
        openBtnRef.current.click();
    };
    const deleteAddress = async () => {
        await AddressActions.removeAddress(address.address_id);
        setAddressList((prevList) => {
            return prevList.filter((item) => item.address_id !== address.address_id);
        });
        closeBtnRef.current.click();
    };
    return (
        <div className={cx('container')}>
            <div className="row">
                <div className="col col-md-6">
                    <div className={cx('address-info')}>
                        <div className={cx('address-info__contact')}>
                            <span className={cx('address-info__contact-name')}>{address.address_fullname}</span>
                            <span className={cx('address-info__contact-phone')}>{address.address_phone_number}</span>
                            {address.address_is_default && (
                                <span className={cx('address-info__contact-default')}>Mặc định</span>
                            )}
                        </div>
                        <div className={cx('address-info__detail')}>
                            <span className={cx('address-info__detail-icon')}>
                                <FontAwesomeIcon icon={faLocationDot} />
                            </span>
                            <span className={cx('address-info__detail-content')}>{address.address_detail}</span>
                        </div>
                    </div>
                </div>
                <div className="col col-md-3 ms-auto">
                    <div className={cx('address-action')}>
                        <div className={cx('address-action__row')}>
                            <Button primary onClick={() => handleSetDefault()}>
                                <span>Thiết lập mặc định</span>
                            </Button>
                        </div>
                        <div className={cx('address-action__row')}>
                            <Button outline onClick={() => transferToUpdate()}>
                                <span>Sửa</span>
                            </Button>
                            <Button outline onClick={() => confirmDeleteAddress()}>
                                <span>Xóa</span>
                            </Button>
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
                        onClick: () => deleteAddress(),
                    },
                ]}
            >
                <p>
                    Bạn có chắc chắn muốn xóa địa chỉ <strong>{address.address_fullname}</strong> không?
                </p>
            </Modal>
        </div>
    );
};

AddressItem.propTypes = {
    address: PropTypes.object,
    setAddressList: PropTypes.func,
};

export default AddressItem;
