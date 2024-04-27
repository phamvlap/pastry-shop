import { useState, useEffect } from 'react';
import classNames from 'classnames/bind';

import { StaffService } from '~/services/index.js';

import { Table } from '~/components/index.js';
import SearchBar from './partials/SearchBar.jsx';
import ControlPanel from './partials/ControlPanel.jsx';
import StaffActions from '~/utils/staffActions.js';
import StaffRole from '~/enums/StaffRole.js';

import styles from './Staff.module.scss';

const cx = classNames.bind(styles);

const header = {
    staff_id: {
        value: 'Mã nhân viên',
        isModified: false,
    },
    staff_email: {
        value: 'Email',
        isModified: false,
    },
    staff_name: {
        value: 'Tên nhân viên',
        isModified: false,
    },
    staff_role: {
        value: 'Vai trò',
        isModified: false,
    },
    staff_phone_number: {
        value: 'Số điện thoại',
        isModified: false,
    },
    staff_address: {
        value: 'Địa chỉ',
        isModified: false,
    },
};
const actions = {
    edit: {
        value: 'Sửa',
        isDirected: true,
        isModifiedInRow: false,
    },
    delete: {
        value: 'Xóa',
        isDirected: false,
        isModifiedInRow: false,
    },
};
const config = {
    headers: {
        Authorization: `Bearer ${StaffActions.getToken()}`,
    },
};

const Staff = () => {
    const [staffs, setStaffs] = useState([]);
    const [currentFilter, setCurrentFilter] = useState({
        staff_role: 'all',
        staff_name: '',
    });
    const [activeRow, setActiveRow] = useState(null);

    const fetchStaffs = async (filter) => {
        try {
            const customFilter = {};
            if (StaffRole.getKeys().includes(filter.staff_role)) {
                customFilter.staff_role = filter.staff_role.toLowerCase();
            }
            if (filter.staff_name !== '') {
                customFilter.staff_name = filter.staff_name;
            }
            const staffService = new StaffService(config);
            const response = await staffService.getAll(customFilter);
            if (response.status === 'success') {
                const data = response.data.map((staff) => {
                    return {
                        ...staff,
                        staff_role_key: staff.staff_role,
                        staff_role: StaffRole.retrieveRole(staff.staff_role.toUpperCase()),
                    };
                });
                setStaffs(data);
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchStaffs(currentFilter);
    }, [currentFilter]);

    return (
        <div className={cx('staff-container')}>
            <h2 className={cx('staff-title')}>Danh sách nhân viên</h2>
            <ControlPanel />
            <div className="mt-3">
                <SearchBar setCurrentFilter={setCurrentFilter} />
            </div>
            <div className="mt-3">
                <Table
                    entityName="staff"
                    header={header}
                    data={staffs}
                    setData={setStaffs}
                    actions={actions}
                    setActiveRow={setActiveRow}
                />
            </div>
        </div>
    );
};

export default Staff;
