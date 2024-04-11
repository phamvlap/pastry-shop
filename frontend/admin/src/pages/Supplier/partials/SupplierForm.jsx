import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import classNames from 'classnames/bind';

import { Form, InputGroup, Button } from '~/components/index.js';
import Validator from '~/utils/validator.js';
import staffActions from '~/utils/staffActions.js';
import SupplierService from '~/services/supplier.service.js';

import styles from '~/pages/Supplier/Supplier.module.scss';

const cx = classNames.bind(styles);

const rules = [
    {
        field: 'supplier_name',
        method: 'isEmpty',
        validWhen: false,
        message: 'Tên nhà cung ứng là bắt buộc',
    },
    {
        field: 'supplier_name',
        method: 'isLength',
        args: [
            {
                min: 3,
            },
        ],
        validWhen: true,
        message: 'Tên nhà cung ứng tối thiểu 3 ký tự',
    },
    {
        field: 'supplier_phone_number',
        method: 'isEmpty',
        validWhen: false,
        message: 'SỐ địện thoại là bắt buộc',
    },
    {
        field: 'supplier_phone_number',
        method: 'isMobilePhone',
        args: ['vi-VN'],
        validWhen: true,
        message: 'Số điện thoại không hợp lệ',
    },
    {
        field: 'supplier_email',
        method: 'isEmpty',
        validWhen: false,
        message: 'Email là bắt buộc',
    },
    {
        field: 'supplier_email',
        method: 'isLength',
        args: [
            {
                min: 3,
            },
        ],
        validWhen: true,
        message: 'Email tối thiểu 3 ký tự',
    },
    {
        field: 'supplier_address',
        method: 'isEmpty',
        validWhen: false,
        message: 'Địa chỉ là bắt buộc',
    },
    {
        field: 'supplier_address',
        method: 'isLength',
        args: [
            {
                min: 3,
            },
        ],
        validWhen: true,
        message: 'Địa chỉ tối thiểu 3 ký tự',
    },
];
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
    const validator = new Validator(rules);

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
            if (isUpdating) {
                await supplierService.update(supplier.supplier_id, form);
            } else {
                await supplierService.create(form);
            }
            setForm({});
            setSupplier({});
            setIsUpdating(false);
        } catch (error) {
            setErrors({ form: error.message });
        }
    };
    const changeActionToAdd = (event) => {
        event.preventDefault();
        setForm({});
        setErrors({});
        setIsUpdating(false);
    };

    useEffect(() => {
        if (Object.keys(supplier).length === 0) {
            return;
        }
        const startDate = new Date(supplier.supplier_start);
        const endDate = new Date(supplier.supplier_end);
        const newSupplier = {
            ...supplier,
            supplier_start: `${startDate.getFullYear()}-${
                startDate.getMonth() + 1 < 10 ? `0${startDate.getMonth() + 1}` : startDate.getMonth() + 1
            }-${startDate.getDate() < 10 ? `0${startDate.getDate()}` : startDate.getDate()}`,
            supplier_end: `${endDate.getFullYear()}-${
                endDate.getMonth() + 1 < 10 ? `0${endDate.getMonth() + 1}` : endDate.getMonth() + 1
            }-${endDate.getDate() < 10 ? `0${endDate.getDate()}` : endDate.getDate()}`,
        };
        setForm(newSupplier);
        setErrors({});
        setIsUpdating(true);
    }, [supplier]);

    return (
        <div className={cx('supplier-form')}>
            <h2 className={cx('supplier-title')}>{!isUpdating ? 'Thêm nhà cung ứng mới' : 'Cập nhật nhà cung ứng'} </h2>
            <div className={cx('supplier-form__body')}>
                {isUpdating && (
                    <Button primary className="mb-3" onClick={changeActionToAdd}>
                        Thêm mới
                    </Button>
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
                            onClick: (event) => changeActionToAdd(event),
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
                            value={form['supplier_name']}
                            onChange={handleOnChange}
                            error={errors['supplier_name']}
                        />
                        <InputGroup
                            label="Số điện thoại"
                            type="text"
                            name="supplier_phone_number"
                            value={form['supplier_phone_number']}
                            onChange={handleOnChange}
                            error={errors['supplier_phone_number']}
                        />
                        <InputGroup
                            label="Email"
                            type="text"
                            name="supplier_email"
                            value={form['supplier_email']}
                            onChange={handleOnChange}
                            error={errors['supplier_email']}
                        />
                        <InputGroup
                            label="Địa chỉ"
                            type="text"
                            name="supplier_address"
                            value={form['supplier_address']}
                            onChange={handleOnChange}
                            error={errors['supplier_address']}
                        />
                    </>
                </Form>
            </div>
        </div>
    );
};

SupplierForm.propTypes = {
    supplier: PropTypes.object,
    setSupplier: PropTypes.func,
};

export default SupplierForm;
