import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';

import { Form, InputGroup, Modal, Button } from '~/components/index.js';
import Validator from '~/utils/validator.js';
import staffRules from '~/config/rules/staff.js';
import StaffRole from '~/enums/StaffRole.js';
import { StaffService } from '~/services/index.js';
import StaffActions from '~/utils/staffActions';

let roles = [
    {
        value: '',
        name: 'Chọn chức vụ',
    },
];
roles.push(
    ...StaffRole.getKeys().map((role) => {
        return {
            value: role,
            name: StaffRole.retrieveRole(role),
        };
    }),
);
const config = {
    headers: {
        Authorization: `Bearer ${StaffActions.getToken()}`,
    },
};

const AddForm = ({ staff }) => {
    const [form, setForm] = useState({
        ...staff,
        staff_role: staff?.staff_role.toUpperCase(),
    });
    const [errors, setErrors] = useState({});
    const [account, setAccount] = useState({});

    const infoModalRef = useRef(null);
    const warningModalRef = useRef(null);
    const validator = new Validator(staffRules);
    const navigate = useNavigate();

    const onChange = (event) => {
        setForm({
            ...form,
            [event.target.name]: event.target.value,
        });
    };
    const handleSubmit = async (event) => {
        event.preventDefault();

        const newErrors = validator.validate(form);

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        try {
            const staffService = new StaffService(config);
            if (form.staff_id) {
                const response = await staffService.update(form.staff_id, form);
                if (response.status === 'success') {
                    toast.success('Cập nhật nhân viên thành công', {
                        onClose: () => navigate('/staffs'),
                    });
                } else {
                    toast.error('Cập nhật nhân viên thất bại');
                }
                return;
            } else {
                const response = await staffService.create(form);
                if (response.status === 'success') {
                    setAccount({
                        account_email: response.data.staff_email,
                        account_password: response.data.staff_password,
                    });
                    infoModalRef.current.click();
                } else {
                    toast.error('Thêm nhân viên mới thất bại');
                }
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <>
            <Form
                buttons={[
                    {
                        type: 'secondary',
                        name: 'Hủy',
                        onClick: (event) => {
                            event.preventDefault();
                            warningModalRef.current.click();
                        },
                    },
                    {
                        type: 'primary',
                        name: form.staff_id ? 'Cập nhật' : 'Thêm mới',
                    },
                ]}
                onSubmit={(event) => handleSubmit(event)}
                errors={errors}
            >
                <>
                    <InputGroup
                        label="Tên nhân viên"
                        name="staff_name"
                        value={form.staff_name}
                        onChange={(event) => onChange(event)}
                        error={errors.staff_name}
                        placeholder="Nhập tên nhân viên"
                    />
                    <InputGroup
                        label="Số điện thoại"
                        name="staff_phone_number"
                        value={form.staff_phone_number}
                        onChange={(event) => onChange(event)}
                        error={errors.staff_phone_number}
                        placeholder="Nhập số điện thoại"
                    />
                    <InputGroup
                        label="Địa chỉ"
                        name="staff_address"
                        value={form.staff_address}
                        onChange={(event) => onChange(event)}
                        error={errors.staff_address}
                        placeholder="Nhập địa chỉ"
                    />
                    <InputGroup
                        label="Chức vụ"
                        type="select"
                        name="staff_role"
                        value={form.staff_role}
                        onChange={(event) => onChange(event)}
                        error={errors.staff_role}
                        options={roles}
                    />
                </>
            </Form>

            <Button ref={infoModalRef} data-bs-toggle="modal" data-bs-target="#info-success-create-staff" />
            <Modal
                id="info-success-create-staff"
                title="Thông báo"
                buttons={[
                    {
                        type: 'primary',
                        text: 'Đồng ý',
                        onClick: () => navigate('/staffs'),
                        dismiss: 'modal',
                    },
                ]}
            >
                <div>
                    <p>Thêm nhân viên mới thành công. Tài khoản của nhân viên mới là:</p>
                    <p>
                        <span>Email: </span>
                        <strong>{account.account_email}</strong>
                    </p>
                    <p>
                        <span>Mật khẩu: </span>
                        <strong>{account.account_password}</strong>
                    </p>
                </div>
            </Modal>

            <Button ref={warningModalRef} data-bs-toggle="modal" data-bs-target="#warning-cancel-action" />
            <Modal
                id="warning-cancel-action"
                title="Cảnh báo"
                buttons={[
                    {
                        type: 'secondary',
                        text: 'Hủy bỏ',
                        dismiss: 'modal',
                    },
                    {
                        type: 'primary',
                        text: 'Đồng ý',
                        onClick: () => navigate('/staffs'),
                        dismiss: 'modal',
                    },
                ]}
            >
                <p>Bạn có chắc chắn muốn hủy bỏ thao tác này không?</p>
            </Modal>
        </>
    );
};

AddForm.propTypes = {
    staff: PropTypes.object,
};

export default AddForm;
