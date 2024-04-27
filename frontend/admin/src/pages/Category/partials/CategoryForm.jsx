import { useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { toast } from 'react-toastify';

import { Form, InputGroup } from '~/components/index.js';
import { Validator, staffActions } from '~/utils/index.js';
import { CategoryService } from '~/services/index.js';
import categoryRules from '~/config/rules/category.js';

import styles from './../Category.module.scss';

const cx = classNames.bind(styles);

const config = {
    headers: {
        authorization: `Bearer ${staffActions.getToken()}`,
    },
};

const CategoryForm = ({ category, setCategory }) => {
    const [form, setForm] = useState({
        ...category,
    });
    const [errors, setErrors] = useState({});
    const validator = new Validator(categoryRules);
    const categoryService = new CategoryService(config);

    const handleFormChange = (event) => {
        setForm({
            ...form,
            [event.target.name]: event.target.value,
        });
    };
    const onSubmit = async (event) => {
        event.preventDefault();
        const newErrors = validator.validate(form);
        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) {
            return;
        }
        try {
            const response = await categoryService.create(form);
            if (response.status === 'success') {
                setCategory({
                    ...form,
                });
                setForm({
                    category_name: '',
                });
                toast.success('Thêm danh mục thành công');
            }
        } catch (error) {
            console.error('CategoryForm.onSubmit', error);
        }
    };

    return (
        <div className={cx('form-container')}>
            <h2 className={cx('form-title')}>Thêm danh mục mới</h2>
            <div className={cx('form-content')}>
                <Form
                    buttons={[
                        {
                            name: 'Thêm danh mục',
                            type: 'success',
                        },
                    ]}
                    onSubmit={onSubmit}
                    form={form}
                    errors={errors}
                >
                    <>
                        <InputGroup
                            label="Tên danh mục"
                            type="text"
                            name="category_name"
                            value={form['category_name']}
                            onChange={handleFormChange}
                            error={errors['category_name']}
                        />
                    </>
                </Form>
            </div>
        </div>
    );
};

CategoryForm.propTypes = {
    category: PropTypes.object,
    setCategory: PropTypes.func,
};

export default CategoryForm;
