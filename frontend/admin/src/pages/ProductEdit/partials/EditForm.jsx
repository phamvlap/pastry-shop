import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import FormData from 'form-data';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

import ColumnLayout from '~/layouts/ColumnLayout/ColumnLayout.jsx';
import productRules from '~/config/rules/product.js';
import { Form, InputGroup } from '~/components/index.js';
import { ProductService } from '~/services/index.js';
import { Validator, staffActions, formatDate } from '~/utils/index.js';

const config = {
    headers: {
        'Content-Type': 'multipart/form-data',
        authorization: `Bearer ${staffActions.getToken()}`,
    },
};

const EditForm = ({ productId, categories, discounts, suppliers }) => {
    const [form, setForm] = useState({});
    const [errors, setErrors] = useState({});
    const [images, setImages] = useState([]);

    const navigate = useNavigate();
    const rules = productRules.filter((rule) => {
        return rule.field !== 'product_images';
    });
    const validator = new Validator(rules);
    const productService = new ProductService(config);

    useEffect(() => {
        productService.get(productId).then((response) => {
            const item = {
                product_name: response.data.product_name,
                product_stock_quantity: response.data.product_stock_quantity,
                product_price: response.data.price.price_value,
                product_expire_date: formatDate.convertToStandardFormat(response.data.product_expire_date),
                product_description: response.data.product_description,
                product_category: response.data?.category ? response.data?.category.category_id : 'none',
                product_supplier: response.data?.supplier ? response.data?.supplier.supplier_id : 'none',
                product_discount: response.data?.discount ? response.data?.discount.discount_id : 'none',
            };
            setForm(item);
            const imageList = response.data.product_images.split(';').map((image) => {
                return {
                    src: `${import.meta.env.VITE_UPLOAD_PRODUCTS_DIR}/${image}`,
                };
            });
            setImages(imageList);
        });
    }, [productId]);

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
            title: 'Bạn có chắc muốn cập nhật sản phẩm này ?',
            text: 'Dữ liệu đã nhập sẽ được lưu!',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Đồng ý',
            cancelButtonText: 'Hủy',
        }).then((result) => {
            if (result.isConfirmed) {
                handleUpdateProduct();
                Swal.fire('Đã thêm sản phẩm mới!', '', 'success').then(() => {
                    navigate('/products');
                });
            }
        });
    };
    const handleUpdateProduct = async () => {
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
            if (form['product_images'] && form['product_images'].length > 0) {
                for (let i = 0; i < form['product_images'].length; i++) {
                    formData.append('product_images', form['product_images'][i]);
                }
            }
            console.log(formData);
            await productService.update(productId, formData);
        } catch (error) {
            throw new Error(error.message);
        }
    };
    const handleCancelUpdateProduct = (event) => {
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
                    name: 'Cập nhật',
                },
                {
                    type: 'danger',
                    name: 'Hủy',
                    onClick: (event) => handleCancelUpdateProduct(event),
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
                                    {/* {images.length > 0 &&
                                        images.map((image, index) => {
                                            return (
                                                <img
                                                    key={index}
                                                    src={image.src}
                                                    style={{ width: '100px', height: '100px' }}
                                                />
                                            );
                                        })} */}
                                </>
                            ),
                        },
                    ]}
                />
            </>
        </Form>
    );
};

EditForm.propTypes = {
    productId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    categories: PropTypes.array,
    discounts: PropTypes.array,
    suppliers: PropTypes.array,
};

export default EditForm;
