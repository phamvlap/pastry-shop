import classNames from 'classnames/bind';

import AddressItem from '~/components/AddressItem/AddressItem.jsx';
import styles from '~/pages/UserAddress/UserAddress.module.scss';

const cx = classNames.bind(styles);

const UserAddress = () => {
    return (
        <div className={cx('address-wrapper')}>
            <h3 className={cx('address-title')}>Địa chỉ của tôi</h3>
            <div className={cx('address-content')}>
                <AddressItem />
                <AddressItem />
                <AddressItem />
            </div>
        </div>
    );
};

export default UserAddress;
