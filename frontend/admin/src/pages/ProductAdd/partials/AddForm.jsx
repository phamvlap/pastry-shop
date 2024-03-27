import PropTypes from 'prop-types';
import { useState } from 'react';
import FormData from 'form-data';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

import ColumnLayout from '~/layouts/ColumnLayout/ColumnLayout.jsx';
import { Form, InputGroup } from '~/components/index.js';
import productRules from '~/config/rules/product.js';
import { Validator, staffActions } from '~/utils/index.js';
import { ProductService } from '~/services/index.js';

const config = {
    headers: {
        'Content-Type': 'multipart/form-data',
        authorization: `Bearer ${staffActions.getToken()}`,
    },
};

const AddForm = ({ categories, discounts, suppliers }) => {
    const [form, setForm] = useState({});
    const [errors, setErrors] = useState({});
    const [images, setImages] = useState([]);

    const navigate = useNavigate();
    const validator = new Validator(productRules);
    const productService = new ProductService(config);

    const handleChange = (event) => {
        if (event.target.type === 'file') {
            const imageList = [];
            for (let i = 0; i < event.target.files.length; i++) {
                imageList.push(event.target.files[i]);
            }
            setImages(imageList);
            setForm({
                ...form,
                [event.target.name]: imageList,
            });
        } else {
            setForm({
                ...form,
                [event.target.name]: event.target.value,
            });
        }
    };
    const handleSubmit = async (event) => {
        event.preventDefault();
        const newErrors = validator.validate(form);
        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) {
            return;
        }
        Swal.fire({
            title: 'Bạn có chắc muốn thêm sản phẩm mới ?',
            text: 'Dữ liệu đã nhập sẽ được lưu!',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Đồng ý',
            cancelButtonText: 'Hủy',
        }).then((result) => {
            if (result.isConfirmed) {
                handleAddProduct();
                Swal.fire('Đã thêm sản phẩm mới!', '', 'success').then(() => {
                    navigate('/products');
                });
            }
        });
    };
    const handleAddProduct = async () => {
        try {
            let formData = new FormData();
            formData.append('product_name', form['product_name']);
            formData.append('product_stock_quantity', form['product_stock_quantity']);
            formData.append('product_price', form['product_price']);
            formData.append('product_expire_date', form['product_expire_date']);
            formData.append('product_description', form['product_description']);
            formData.append('category_id', form['product_category']);
            formData.append('supplier_id', form['product_supplier']);
            formData.append('discount_id', form['product_discount']);
            for (let i = 0; i < form['product_images'].length; i++) {
                formData.append('product_images', form['product_images'][i]);
            }
            await productService.create(formData);
        } catch (error) {
            throw new Error(error.message);
        }
    };
    const handleCancelAddProduct = (event) => {
        event.preventDefault();
        Swal.fire({
            title: 'Bạn có chắc muốn hủy việc thêm sản phẩm mới ?',
            text: 'Dữ liệu đã nhập sẽ không được lưu!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Đồng ý',
            cancelButtonText: 'Hủy',
        }).then((result) => {
            if (result.isConfirmed) {
                navigate('/products');
            }
        });
    };

    return (
        <Form
            buttons={[
                {
                    type: 'success',
                    name: 'Thêm',
                },
                {
                    type: 'danger',
                    name: 'Hủy',
                    onClick: (event) => handleCancelAddProduct(event),
                },
            ]}
            onSubmit={handleSubmit}
            errors={errors}
            enctype="multipart/form-data"
        >
            <>
                <ColumnLayout
                    className="mt-3"
                    sides={[
                        {
                            columns: 3,
                            element: (
                                <>
                                    <InputGroup
                                        label="Tên sản phẩm"
                                        type="text"
                                        name="product_name"
                                        value={form['product_name']}
                                        error={errors['product_name']}
                                        onChange={(event) => handleChange(event)}
                                    />
                                    <InputGroup
                                        label="Số lượng"
                                        type="text"
                                        name="product_stock_quantity"
                                        value={form['product_stock_quantity']}
                                        error={errors['product_stock_quantity']}
                                        onChange={(event) => handleChange(event)}
                                    />
                                </>
                            ),
                        },
                        {
                            columns: 3,
                            element: (
                                <>
                                    <InputGroup
                                        label="Giá bán"
                                        type="text"
                                        name="product_price"
                                        value={form['product_price']}
                                        error={errors['product_price']}
                                        onChange={(event) => handleChange(event)}
                                    />
                                    <InputGroup
                                        label="Ngày hết hạn"
                                        type="date"
                                        name="product_expire_date"
                                        value={form['product_expire_date']}
                                        error={errors['product_expire_date']}
                                        onChange={(event) => handleChange(event)}
                                    />
                                </>
                            ),
                        },
                        {
                            columns: 3,
                            element: (
                                <>
                                    <InputGroup
                                        label="Danh mục"
                                        type="select"
                                        name="product_category"
                                        options={categories}
                                        value={form['product_category']}
                                        error={errors['product_category']}
                                        onChange={(event) => handleChange(event)}
                                        defaultOption={{
                                            value: 'none',
                                            name: '-- Chọn danh mục --',
                                        }}
                                    />
                                    <InputGroup
                                        label="Nhà cung cấp"
                                        type="select"
                                        name="product_supplier"
                                        options={suppliers}
                                        value={form['product_supplier']}
                                        error={errors['product_supplier']}
                                        onChange={(event) => handleChange(event)}
                                        defaultOption={{
                                            value: 'none',
                                            name: '-- Chọn nhà cung ứng --',
                                        }}
                                    />
                                </>
                            ),
                        },
                        {
                            columns: 3,
                            element: (
                                <InputGroup
                                    label="Mã giảm giá"
                                    type="select"
                                    name="product_discount"
                                    options={discounts}
                                    value={form['product_discount']}
                                    error={errors['product_discount']}
                                    onChange={(event) => handleChange(event)}
                                    defaultOption={{
                                        value: 'none',
                                        name: '-- Chọn mã giảm giá --',
                                    }}
                                />
                            ),
                        },
                    ]}
                />
                <ColumnLayout
                    sides={[
                        {
                            columns: 6,
                            element: (
                                <InputGroup
                                    label="Mô tả sản phẩm"
                                    type="textarea"
                                    rows={5}
                                    name="product_description"
                                    value={form['product_description']}
                                    error={errors['product_description']}
                                    onChange={(event) => handleChange(event)}
                                />
                            ),
                        },
                        {
                            columns: 6,
                            element: (
                                <>
                                    <InputGroup
                                        label="Ảnh sản phẩm"
                                        type="file"
                                        name="product_images"
                                        error={errors['product_images']}
                                        onChange={(event) => handleChange(event)}
                                        multiple={true}
                                    />
                                    {images.length > 0 &&
                                        images.map((image, index) => {
                                            return (
                                                <img
                                                    key={index}
                                                    src={URL.createObjectURL(image)}
                                                    style={{ width: '100px', height: '100px' }}
                                                />
                                            );
                                        })}
                                </>
                            ),
                        },
                    ]}
                />
            </>
        </Form>
    );
};

AddForm.propTypes = {
    categories: PropTypes.array,
    discounts: PropTypes.array,
    suppliers: PropTypes.array,
};

export default AddForm;