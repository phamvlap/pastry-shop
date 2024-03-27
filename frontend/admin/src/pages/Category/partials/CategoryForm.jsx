import { useState } from 'react';
import PropTypes from 'prop-types';

import { Heading, Form, InputGroup } from '~/components/index.js';
import { Validator, staffActions } from '~/utils/index.js';
import { CategoryService } from '~/services/index.js';
import categoryRules from '~/config/rules/category.js';

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
    const onSubmit = (event) => {
        event.preventDefault();
        const newErrors = validator.validate(form);
        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) {
            return;
        }
        try {
            categoryService.create(form);
            setCategory({
                ...form,
            });
            setForm({
                category_name: '',
            });
        } catch (error) {
            console.error('CategoryForm.onSubmit', error);
        }
    };

    return (
        <div>
            <Heading title="Thêm danh mục mới" />
            <div className="pt-3 mt-3">
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