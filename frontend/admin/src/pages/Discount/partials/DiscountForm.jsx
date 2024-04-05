import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import classNames from 'classnames/bind';

import { Heading, Form, InputGroup, Button } from '~/components/index.js';
import { staffActions, Validator, formatDate } from '~/utils/index.js';
import { DiscountService } from '~/services/index.js';
import discountRules from '~/config/rules/discount.js';

import styles from '~/pages/Discount/Discount.module.scss';

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
                await discountService.update(discount.discount_id, form);
            } else {
                await discountService.create(form);
            }
            setForm({});
            setDiscount({});
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
        if (Object.keys(discount).length === 0) {
            return;
        }
        const startDate = new Date(discount.discount_start);
        const endDate = new Date(discount.discount_end);
        const newDiscount = {
            ...discount,
            discount_start: `${startDate.getFullYear()}-${
                startDate.getMonth() + 1 < 10 ? `0${startDate.getMonth() + 1}` : startDate.getMonth() + 1
            }-${startDate.getDate() < 10 ? `0${startDate.getDate()}` : startDate.getDate()}`,
            discount_end: `${endDate.getFullYear()}-${
                endDate.getMonth() + 1 < 10 ? `0${endDate.getMonth() + 1}` : endDate.getMonth() + 1
            }-${endDate.getDate() < 10 ? `0${endDate.getDate()}` : endDate.getDate()}`,
        };
        setForm(newDiscount);
        setErrors({});
        setIsUpdating(true);
    }, [discount]);

    return (
        <div className={cx('discount-form')}>
            <Heading title={!isUpdating ? 'Thêm mã giảm giá mới' : 'Cập nhật mã giảm giá'} />
            <div className={cx('discount-form__body')}>
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
                            label="Mã code của mã giảm giá"
                            type="text"
                            name="discount_code"
                            value={form['discount_code']}
                            onChange={handleOnChange}
                            error={errors['discount_code']}
                        />
                        <div className="row">
                            <div className="col col-md-6">
                                <InputGroup
                                    label="Tỷ lệ giảm giá"
                                    type="number"
                                    name="discount_rate"
                                    value={form['discount_rate']}
                                    onChange={handleOnChange}
                                    error={errors['discount_rate']}
                                />
                            </div>
                            <div className="col col-md-6">
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
                            <div className="col col-md-6">
                                <InputGroup
                                    label="Ngày bắt đầu"
                                    type="date"
                                    name="discount_start"
                                    value={form['discount_start']}
                                    onChange={handleOnChange}
                                    error={errors['discount_start']}
                                />
                            </div>
                            <div className="col col-md-6">
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
            </div>
        </div>
    );
};

DiscountForm.propTypes = {
    discount: PropTypes.object,
    setDiscount: PropTypes.func,
};

export default DiscountForm;
