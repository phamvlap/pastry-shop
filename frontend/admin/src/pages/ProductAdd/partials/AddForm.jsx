import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import FormData from 'form-data';
import { toast } from 'react-toastify';
import classNames from 'classnames/bind';

import { Form, InputGroup, Modal, Button } from '~/components/index.js';
import productRules from '~/config/rules/product.js';
import { Validator, staffActions } from '~/utils/index.js';
import { ProductService } from '~/services/index.js';
import routes from '~/config/routes.js';

import styles from './../ProductAdd.module.scss';

const cx = classNames.bind(styles);

const config = {
    headers: {
        'Content-Type': 'multipart/form-data',
        authorization: `Bearer ${staffActions.getToken()}`,
    },
};

const updateRules = productRules.filter((rule) => rule.field !== 'product_images');

const AddForm = ({ categories, discounts, suppliers, product }) => {
    const [form, setForm] = useState({
        ...product,
    });
    const [errors, setErrors] = useState({});
    const [images, setImages] = useState([]);
    const [isUploadedImage, setIsUploadedImage] = useState(false);

    const navigate = useNavigate();
    const validator = new Validator(product.product_id ? updateRules : productRules);
    const productService = new ProductService(config);
    const openBtnRef = useRef();

    useEffect(() => {
        if (product.product_id) {
            setForm(product);
            const images = product.product_images.map((image) => {
                return {
                    src: `${import.meta.env.VITE_UPLOADED_DIR}${image.image_url.split('/uploads/')[1]}`,
                };
            });
            setImages(images);
        }
    }, [product]);

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
        if (event.target.name === 'product_images') {
            setIsUploadedImage(true);
        }
    };
    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!isUploadedImage) {
            delete form['product_images'];
        }

        const newErrors = validator.validate(form);
        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) {
            return;
        }
        handleAddProduct();
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
            if (form['product_images']) {
                for (let i = 0; i < form['product_images'].length; i++) {
                    formData.append('product_images', form['product_images'][i]);
                }
            }
            let response = null;
            if (product.product_id > 0) {
                response = await productService.update(product.product_id, formData);
            } else {
                response = await productService.create(formData);
            }
            if (response.status === 'success') {
                toast.success(`Sản phẩm đã được ${product.product_id ? 'cập nhật' : 'thêm'} thành công!`, {
                    onClose: () => navigate(routes.products),
                });
            }
        } catch (error) {
            throw new Error(error.message);
        }
    };
    const handleCancelAddProduct = (event) => {
        event.preventDefault();
        openBtnRef.current.click();
    };

    return (
        <>
            <Form
                buttons={[
                    {
                        type: 'success',
                        name: form.product_id > 0 ? 'Cập nhật' : 'Thêm',
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
                    <div className="row">
                        <div className="col col-md-3">
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
                        </div>
                        <div className="col col-md-3">
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
                        </div>
                        <div className="col col-md-3">
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
                        </div>
                        <div className="col col-md-3">
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
                        </div>
                    </div>

                    <div className="row">
                        <div className="col col-md-6">
                            <InputGroup
                                label="Mô tả sản phẩm"
                                type="textarea"
                                rows={5}
                                name="product_description"
                                value={form['product_description']}
                                error={errors['product_description']}
                                onChange={(event) => handleChange(event)}
                            />
                        </div>
                        <div className="col col-md-6">
                            <InputGroup
                                label="Ảnh sản phẩm"
                                type="file"
                                name="product_images"
                                error={errors['product_images']}
                                onChange={(event) => handleChange(event)}
                                multiple={true}
                            />
                            {isUploadedImage
                                ? images.length > 0 &&
                                  images.map((image, index) => {
                                      return (
                                          <img
                                              key={index}
                                              src={URL.createObjectURL(image)}
                                              style={{ width: '100px', height: '100px' }}
                                              className={cx('image-item')}
                                          />
                                      );
                                  })
                                : images.length > 0 &&
                                  images.map((image, index) => {
                                      return (
                                          <img
                                              key={index}
                                              src={image.src}
                                              style={{ width: '100px', height: '100px' }}
                                              className={cx('image-item')}
                                          />
                                      );
                                  })}
                        </div>
                    </div>
                </>
            </Form>
            <Button
                type="button"
                data-bs-toggle="modal"
                data-bs-target="#confirm-cancel-modal"
                ref={openBtnRef}
            ></Button>
            <Modal
                id="confirm-cancel-modal"
                title="Xác nhận hủy bỏ"
                buttons={[
                    {
                        type: 'secondary',
                        text: 'Hủy',
                        dismiss: 'modal',
                    },
                    {
                        type: 'primary',
                        text: 'Đồng ý',
                        onClick: () => navigate(routes.products),
                        dismiss: 'modal',
                    },
                ]}
            >
                <p>Bạn có chắc chắn muốn hủy việc {product.product_id ? 'cập nhật sản phẩm' : 'thêm sản phẩm mới'}?</p>
            </Modal>
        </>
    );
};

AddForm.propTypes = {
    categories: PropTypes.array,
    discounts: PropTypes.array,
    suppliers: PropTypes.array,
    product: PropTypes.object,
};

export default AddForm;
