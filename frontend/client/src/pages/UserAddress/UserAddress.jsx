import { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

import AddressItem from '~/components/AddressItem/AddressItem.jsx';
import addressActions from '~/utils/addressActions.js';
import styles from '~/pages/UserAddress/UserAddress.module.scss';

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
                <Link to="/user/address/add" className={cx('address-add')}>
                    <span>
                        <FontAwesomeIcon icon={faPlus} />
                        <span>Thêm địa chỉ mới</span>
                    </span>
                </Link>
            </h3>
            <div className={cx('address-content')}>
                {addressList.map((address) => (
                    <AddressItem key={address.address_id} address={address} setAddressList={setAddressList} />
                ))}
            </div>
        </div>
    );
};

export default UserAddress;
