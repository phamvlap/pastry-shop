import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot } from '@fortawesome/free-solid-svg-icons';

import { Button } from '~/components/index.js';
import AddressActions from '~/utils/addressActions.js';

import styles from '~/components/AddressItem/AddressItem.module.scss';

const cx = classNames.bind(styles);

const AddressItem = ({ address, setAddressList }) => {
    const navigate = useNavigate();

    const handleSetDefault = async () => {
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
    };
    const transferToUpdate = () => {
        navigate('/user/address/add', {
            state: {
                address,
            },
        });
    };
    const handleDelete = async () => {
        await AddressActions.removeAddress(address.address_id);
        setAddressList((prevList) => {
            return prevList.filter((item) => item.address_id !== address.address_id);
        });
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
                            <Button outline onClick={() => handleSetDefault()}>
                                Thiết lập mặc định
                            </Button>
                        </div>
                        <div className={cx('address-action__row')}>
                            <Button outline onClick={() => transferToUpdate()}>
                                Sửa
                            </Button>
                            <Button outline onClick={() => handleDelete()}>
                                Xóa
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

AddressItem.propTypes = {
    address: PropTypes.object,
    setAddressList: PropTypes.func,
};

export default AddressItem;
