import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

import { AddressItem } from '~/components/index.js';
import addressActions from '~/utils/addressActions.js';
import routes from '~/config/routes.js';

import styles from './UserAddress.module.scss';

const cx = classNames.bind(styles);

const UserAddress = () => {
    const [addressList, setAddressList] = useState([]);

    const fetchAddresses = async () => {
        const response = await addressActions.getAddresses();
        setAddressList(response.data);
    };

    useEffect(() => {
        fetchAddresses();
    }, []);

    return (
        <div className={cx('address-wrapper')}>
            <h3 className={cx('address-title')}>
                <span>Địa chỉ của tôi</span>
                <Link to={routes.userAddressAdd} className={cx('address-add')}>
                    <span>
                        <FontAwesomeIcon icon={faPlus} />
                        <span className={cx('address-add__title')}>Thêm địa chỉ mới</span>
                    </span>
                </Link>
            </h3>
            <div className={cx('address-content')}>
                {addressList.length > 0 ? (
                    addressList.map((address) => (
                        <AddressItem key={address.address_id} address={address} setAddressList={setAddressList} />
                    ))
                ) : (
                    <div className={cx('address-empty')}>
                        <p>Bạn chưa có địa chỉ nào.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserAddress;
