import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';

import { StaffService } from '~/services/index.js';

import { Button } from '~/components/index.js';
import StaffActions from '~/utils/staffActions.js';
import AddForm from './partials/AddForm.jsx';
import routes from '~/config/routes.js';

import styles from './StaffAdd.module.scss';

const cx = classNames.bind(styles);

const config = {
    headers: {
        Authorization: `Bearer ${StaffActions.getToken()}`,
    },
};

const StaffAdd = () => {
    const [staff, setStaff] = useState(null);

    const { id: staffId } = useParams();

    const fetchStaff = async (staffId) => {
        try {
            const staffService = new StaffService(config);
            const response = await staffService.get(staffId);
            if (response.status === 'success') {
                setStaff(response.data);
            } else {
                setStaff({});
            }
        } catch (error) {
            setStaff({});
        }
    };

    useEffect(() => {
        if (staffId) {
            fetchStaff(staffId);
        }
    }, [staffId]);

    return (
        <div className={cx('staff-container')}>
            <h2 className={cx('staff-title')}>{staffId ? 'Cập nhật thông tin nhân viên' : 'Thêm mới nhân viên'}</h2>
            <div className="mt-3">
                <div style={{ marginTop: '8px', marginBottom: '8px' }}>
                    <Button to={routes.staffs} outline leftIcon={<FontAwesomeIcon icon={faChevronLeft} />}>
                        Quay lại
                    </Button>
                </div>
                <div className={cx('staff-form-container')}>
                    <div className={cx('staff-form')}>{staffId ? staff && <AddForm staff={staff} /> : <AddForm />}</div>
                </div>
            </div>
        </div>
    );
};

export default StaffAdd;
