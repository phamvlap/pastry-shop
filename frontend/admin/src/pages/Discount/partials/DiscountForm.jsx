import PropTypes from 'prop-types';
import { useEffect, useState, useRef } from 'react';
import classNames from 'classnames/bind';
import { toast } from 'react-toastify';

import { Form, InputGroup, Button, Modal } from '~/components/index.js';
import { staffActions, Validator, formatDate } from '~/utils/index.js';
import { DiscountService } from '~/services/index.js';
import discountRules from '~/config/rules/discount.js';

import styles from './../Discount.module.scss';

const cx = classNames.bind(styles);

const config = {
    headers: {
        authorization: `Bearer ${staffActions.getToken()}`,
    },
};

const DiscountForm = ({ discount, setDiscount }) => {
    const [form, setForm] = useState(() => {
        if (Object.keys(discount).length > 0) {
            return {
                ...discount,
                discount_start: formatDate.convertToStandardFormat(discount.discount_start),
                discount_end: formatDate.convertToStandardFormat(discount.discount_end),
            };
        }
        return {};
    });
    const [errors, setErrors] = useState({});
    const [isUpdating, setIsUpdating] = useState(false);
    const discountService = new DiscountService(config);
    const validator = new Validator(discountRules);
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
                response = await discountService.update(discount.discount_id, form);
            } else {
                response = await discountService.create(form);
            }
            if (response.status === 'success') {
                toast.success(`${isUpdating ? 'Cập nhật' : 'Thêm'} mã giảm giá thành công!`, {
                    onClose: () => {
                        setForm({});
                        setDiscount({});
                        setIsUpdating(false);
                    },
                });
            }
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
    const showModal = () => {
        openBtnRef.current.click();
    };

    useEffect(() => {
        if (Object.keys(discount).length === 0) {
            return;
        }
        const newDiscount = {
            ...discount,
            discount_start: formatDate.convertToStandardFormat(discount.discount_start),
            discount_end: formatDate.convertToStandardFormat(discount.discount_end),
        };
        setForm(newDiscount);
        setErrors({});
        setIsUpdating(true);
    }, [discount]);

    return (
        <div className={cx('discount-form')}>
            <h2 className={cx('discount-title')}>{!isUpdating ? 'Thêm mã giảm giá mới' : 'Cập nhật mã giảm giá'}</h2>
            <div className={cx('discount-form__body')}>
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
                            onClick: () => showModal(),
                        },
                    ]}
                    onSubmit={handleSubmit}
                    errors={errors}
                >
                    <>
                        <InputGroup
                            label="Mã code của mã giảm giá"
                            type="text"
                            name="discount_code"
                            className={cx('discount-container__col')}
                            value={form['discount_code']}
                            onChange={handleOnChange}
                            error={errors['discount_code']}
                        />
                        <div className="row">
                            <div className={cx('col col-md-6', 'discount-container__col')}>
                                <InputGroup
                                    label="Tỷ lệ giảm giá (%)"
                                    type="number"
                                    name="discount_rate"
                                    value={form['discount_rate']}
                                    onChange={handleOnChange}
                                    error={errors['discount_rate']}
                                />
                            </div>
                            <div className={cx('col col-md-6', 'discount-container__col')}>
                                <InputGroup
                                    label="Số lượng áp dụng"
                                    type="number"
                                    name="discount_limit"
                                    value={form['discount_limit']}
                                    onChange={handleOnChange}
                                    error={errors['discount_limit']}
                                />
                            </div>
                        </div>
                        <div className="row">
                            <div className={cx('col col-md-6', 'discount-container__col')}>
                                <InputGroup
                                    label="Ngày bắt đầu"
                                    type="date"
                                    name="discount_start"
                                    value={form['discount_start']}
                                    onChange={handleOnChange}
                                    error={errors['discount_start']}
                                />
                            </div>
                            <div className={cx('col col-md-6', 'discount-container__col')}>
                                <InputGroup
                                    label="Ngày kết thúc"
                                    type="date"
                                    name="discount_end"
                                    value={form['discount_end']}
                                    onChange={handleOnChange}
                                    error={errors['discount_end']}
                                />
                            </div>
                        </div>
                    </>
                </Form>
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
        </div>
    );
};

DiscountForm.propTypes = {
    discount: PropTypes.object,
    setDiscount: PropTypes.func,
};

export default DiscountForm;
