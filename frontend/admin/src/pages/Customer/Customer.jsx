import { useEffect, useState, useRef } from 'react';
import classNames from 'classnames/bind';
import { toast } from 'react-toastify';

import { Button, Modal } from '~/components/index.js';
import { CustomerService } from '~/services/index.js';
import StaffActions from '~/utils/staffActions.js';
import Helper from '~/utils/helper.js';
import SearchBar from './SearchBar.jsx';

import styles from './Customer.module.scss';

const cx = classNames.bind(styles);

const header = {
    customer_id: {
        value: 'Mã khách hàng',
    },
    customer_avatar: {
        value: 'Ảnh đại diện',
    },
    customer_username: {
        value: 'Tên đăng nhập',
    },
    customer_name: {
        value: 'Tên khách hàng',
    },
    customer_phone_number: {
        value: 'Số điện thoại',
    },
    customer_status: {
        value: 'Trạng thái',
    },
};
const config = {
    headers: {
        Authorization: `Bearer ${StaffActions.getToken()}`,
    },
};

const Customer = () => {
    const [customers, setCustomers] = useState([]);
    const [activeCustomer, setActiveCustomer] = useState(null);
    const [currentFilter, setCurrentFilter] = useState({
        status: 'all',
        customer_name: '',
    });

    const openLockModalRef = useRef(null);
    const openUnlockModalRef = useRef(null);

    const fetchCustomers = async (filter) => {
        try {
            const customerService = new CustomerService(config);
            const response = await customerService.getAll(filter);
            if (response.status === 'success') {
                const data = response.data.map((customer) => {
                    return {
                        ...customer,
                        customer_avatar: Helper.formatImageUrl(customer.customer_avatar.image_url),
                        customer_status: Helper.formatDateTime(customer.account_deleted_at) === '00:00 01-01-1800',
                    };
                });
                setCustomers(data);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const confirmLockAccount = (customer) => {
        setActiveCustomer(customer);
        openLockModalRef.current.click();
    };
    const handleLockAccount = async (customer) => {
        try {
            const customerService = new CustomerService(config);
            const response = await customerService.lockAccount(customer.customer_id);
            if (response.status === 'success') {
                toast.success('Khóa tài khoản thành công', {
                    onClose: async () => {
                        await fetchCustomers();
                    },
                });
            }
        } catch (error) {
            console.log(error);
        }
    };
    const confirmUnlockAccount = (customer) => {
        setActiveCustomer(customer);
        openUnlockModalRef.current.click();
    };
    const handleUnlockAccount = async (customer) => {
        try {
            const customerService = new CustomerService(config);
            const response = await customerService.unlockAccount(customer.customer_id);
            if (response.status === 'success') {
                toast.success('Mở khóa tài khoản thành công', {
                    onClose: async () => {
                        await fetchCustomers();
                    },
                });
            }
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        fetchCustomers();
    }, []);

    useEffect(() => {
        fetchCustomers(currentFilter);
    }, [currentFilter]);

    return (
        <div className={cx('customer-container')}>
            <h2 className={cx('customer-title')}>Danh sách khách hàng</h2>
            <SearchBar setCurrentFilter={setCurrentFilter} />
            <div className="mt-3">
                <table className={cx('table-container', 'rounded-conners')}>
                    <thead className={cx('head')}>
                        <tr>
                            {Object.keys(header).map((field, index) => {
                                return (
                                    <th key={index} scope="col" className={cx('head', 'cell')}>
                                        {header[field].value}
                                    </th>
                                );
                            })}
                            <th scope="col" className={cx('head', 'cell')}>
                                Thao tác
                            </th>
                        </tr>
                    </thead>
                    <tbody className={cx('body')}>
                        {customers.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={Object.keys(header).length + 1}
                                    className={cx('cell')}
                                    style={{ textAlign: 'center' }}
                                >
                                    Không có dữ liệu
                                </td>
                            </tr>
                        ) : (
                            customers.map((customer, index) => {
                                return (
                                    <tr key={index}>
                                        <td className={cx('cell')}>{customer.customer_id}</td>
                                        <td className={cx('cell')}>
                                            <img className={cx('cell-image')} src={customer.customer_avatar} />
                                        </td>
                                        <td className={cx('cell')}>{customer.customer_username}</td>
                                        <td className={cx('cell')}>{customer.customer_name}</td>
                                        <td className={cx('cell')}>{customer.customer_phone_number}</td>
                                        <td className={cx('cell')}>
                                            {customer.customer_status ? 'Đang hoạt động' : 'Đã bị khóa'}
                                        </td>
                                        <td className={cx('cell')}>
                                            {customer.customer_status ? (
                                                <Button
                                                    danger
                                                    className={cx('table-row__btn')}
                                                    onClick={() => confirmLockAccount(customer)}
                                                >
                                                    Khóa
                                                </Button>
                                            ) : (
                                                <Button
                                                    primary
                                                    className={cx('table-row__btn')}
                                                    onClick={() => confirmUnlockAccount(customer)}
                                                >
                                                    Mở khóa
                                                </Button>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            <Button ref={openLockModalRef} data-bs-toggle="modal" data-bs-target="#confirm-lock-account" />
            <Modal
                id="confirm-lock-account"
                title="Xác nhận khóa tài khoản"
                buttons={[
                    {
                        type: 'secondary',
                        text: 'Hủy',
                        dismiss: 'modal',
                    },
                    {
                        type: 'primary',
                        text: 'Đồng ý',
                        onClick: () => handleLockAccount(activeCustomer),
                        dismiss: 'modal',
                    },
                ]}
            >
                <p>
                    Bạn có chắc chắn muốn khóa tài khoản của khách hàng <strong>{activeCustomer?.customer_name}</strong>
                    ?
                </p>
            </Modal>

            <Button ref={openUnlockModalRef} data-bs-toggle="modal" data-bs-target="#confirm-unlock-account" />
            <Modal
                id="confirm-unlock-account"
                title="Xác nhận mở khóa tài khoản"
                buttons={[
                    {
                        type: 'secondary',
                        text: 'Hủy',
                        dismiss: 'modal',
                    },
                    {
                        type: 'primary',
                        text: 'Đồng ý',
                        onClick: () => handleUnlockAccount(activeCustomer),
                        dismiss: 'modal',
                    },
                ]}
            >
                <p>
                    Bạn có chắc chắn muốn mở khóa tài khoản của khách hàng{' '}
                    <strong>{activeCustomer?.customer_name}</strong>?
                </p>
            </Modal>
        </div>
    );
};

export default Customer;
