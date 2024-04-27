import { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { toast } from 'react-toastify';

import { Form, InputGroup, Button, Modal } from '~/components/index.js';
import Validator from '~/utils/validator.js';
import staffActions from '~/utils/staffActions.js';
import SupplierService from '~/services/supplier.service.js';
import supplierRules from '~/config/rules/supplier.js';

import styles from './../Supplier.module.scss';

const cx = classNames.bind(styles);

const config = {
    headers: {
        authorization: `Bearer ${staffActions.getToken()}`,
    },
};

const SupplierForm = ({ supplier, setSupplier }) => {
    const [form, setForm] = useState({
        ...supplier,
    });
    const [errors, setErrors] = useState({});
    const [isUpdating, setIsUpdating] = useState(false);
    const supplierService = new SupplierService(config);
    const validator = new Validator(supplierRules);
    const openBtnRef = useRef(null);

    const handleOnChange = (event) => {
        setForm({ ...form, [event.target.name]: event.target.value });
    };
    const handleSubmit = async (event) => {
        event.preventDefault();

        if (Object.keys(form).length === 0) {
            setErrors({ form: 'Vui lòng điền đầy đủ các trường.' });
            return;
        }
        const newErrors = validator.validate(form);
        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) {
            return;
        }
        try {
            let response = null;
            if (isUpdating) {
                response = await supplierService.update(supplier.supplier_id, form);
            } else {
                response = await supplierService.create(form);
            }
            if (response.status === 'success') {
                toast.success(`Nhà cung ứng đã được ${isUpdating ? 'cập nhật' : 'thêm mới'} thành công.`, {
                    onClose: () => {
                        setForm({});
                        setSupplier({});
                        setIsUpdating(false);
                    },
                });
            }
        } catch (error) {
            console.log(error);
            setErrors({ form: error.message });
        }
    };
    const changeActionToAdd = (event) => {
        event.preventDefault();
        setForm({});
        setErrors({});
        setIsUpdating(false);
    };
    const confirmCancelAction = (event) => {
        event.preventDefault();
        openBtnRef.current.click();
    };

    useEffect(() => {
        if (Object.keys(supplier).length === 0) {
            return;
        }
        setForm(supplier);
        setErrors({});
        setIsUpdating(true);
    }, [supplier]);

    return (
        <div className={cx('supplier-form')}>
            <h2 className={cx('supplier-title')}>{!isUpdating ? 'Thêm nhà cung ứng mới' : 'Cập nhật nhà cung ứng'} </h2>
            <div className={cx('supplier-form__body')}>
                {isUpdating && (
                    <div className={cx('control-bar')}>
                        <Button primary className="mb-3" onClick={changeActionToAdd}>
                            Thêm mới
                        </Button>
                    </div>
                )}
                <Form
                    buttons={[
                        {
                            name: !isUpdating ? 'Thêm' : 'Cập nhật',
                            type: 'success',
                        },
                        {
                            name: 'Hủy',
                            type: 'danger',
                            onClick: (event) => confirmCancelAction(event),
                        },
                    ]}
                    onSubmit={handleSubmit}
                    errors={errors}
                >
                    <>
                        <InputGroup
                            label="Tên nhà cung ứng"
                            type="text"
                            name="supplier_name"
                            value={form.supplier_name}
                            onChange={handleOnChange}
                            error={errors.supplier_name}
                        />
                        <InputGroup
                            label="Số điện thoại"
                            type="text"
                            name="supplier_phone_number"
                            value={form.supplier_phone_number}
                            onChange={handleOnChange}
                            error={errors.supplier_phone_number}
                        />
                        <InputGroup
                            label="Email"
                            type="email"
                            name="supplier_email"
                            value={form.supplier_email}
                            onChange={handleOnChange}
                            error={errors.supplier_email}
                        />
                        <InputGroup
                            label="Địa chỉ"
                            type="text"
                            name="supplier_address"
                            value={form.supplier_address}
                            onChange={handleOnChange}
                            error={errors.supplier_address}
                        />
                    </>
                </Form>
            </div>
            <Button
                type="button"
                data-bs-toggle="modal"
                data-bs-target="#confirm-cancel-update-discount"
                ref={openBtnRef}
            ></Button>
            <Modal
                id="confirm-cancel-update-discount"
                title="Xác nhận hủy bỏ"
                buttons={[
                    {
                        type: 'secondary',
                        text: 'Hủy',
                        dismiss: 'modal',
                    },
                    {
                        type: 'danger',
                        text: 'Đồng ý',
                        onClick: (event) => changeActionToAdd(event),
                        dismiss: 'modal',
                    },
                ]}
            >
                <p>Bạn có chắc chắn muốn hủy bỏ {!isUpdating ? 'thêm mới' : 'cập nhật'} mã giảm giá này không?</p>
            </Modal>
        </div>
    );
};

SupplierForm.propTypes = {
    supplier: PropTypes.object,
    setSupplier: PropTypes.func,
};

export default SupplierForm;
