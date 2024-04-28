import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faTrashCan, faChevronLeft, faPlus } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';

import { formatDate, staffActions } from '~/utils/index.js';
import { ProductService } from '~/services/index.js';
import ImageList from './partials/ImageList.jsx';
import { Button, Paragraph, Modal } from '~/components/index.js';
import routes from '~/config/routes.js';
import Helper from '~/utils/helper.js';

import styles from './ProductDetail.module.scss';

const cx = classNames.bind(styles);

const configApi = {
    headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${staffActions.getToken()}`,
    },
};

const ProductDetail = () => {
    const [product, setProduct] = useState({});
    const [images, setImages] = useState([]);

    const { id: productId } = useParams();
    const navigate = useNavigate();
    const productService = new ProductService(configApi);
    const openBtnRef = useRef();

    const fetchProduct = async () => {
        try {
            const response = await productService.getById(productId);
            const data = response.data;
            const item = {
                product_id: data.product_id,
                product_name: data.product_name,
                product_stock_quantity: data.product_stock_quantity,
                product_sold_quantity: data.product_sold_quantity,
                product_price: data.price.price_value,
                product_description: data.product_description,
                product_expire_date: formatDate.convertToViewFormat(data.product_expire_date),
                category_name: data.category?.category_name,
                supplier_name: data.supplier.supplier_name,
                discount_code: data.discount.discount_code,
                latest_update: formatDate.convertToViewFormat(data.product_updated_at),
            };
            const imageList = data.images.map((image) => {
                return {
                    src: `${import.meta.env.VITE_UPLOADED_DIR}${image.image_url.split('/uploads/')[1]}`,
                };
            });
            setProduct(item);
            setImages(imageList);
        } catch (error) {
            console.error(error);
        }
    };
    const confirmDeleteItem = () => {
        openBtnRef.current.click();
    };
    useEffect(() => {
        fetchProduct();
    }, []);

    const handleDeleteItem = async () => {
        try {
            const productService = new ProductService();
            const response = await productService.delete(productId);
            if (response.status === 'success') {
                toast.success('Xóa sản phẩm thành công!', {
                    onClose: () => navigate(routes.products),
                });
            }
        } catch (error) {
            toast.error('Xóa sản phẩm thất bại!');
        }
    };

    return (
        <div className={cx('wrapper')}>
            <h2 className={cx('product-title')}>Chi tiết sản phẩm</h2>
            <div className="mt-3">
                <div className={cx('control-bar')}>
                    <Button to={routes.products} outline leftIcon={<FontAwesomeIcon icon={faChevronLeft} />}>
                        Quay lại
                    </Button>
                    <Button to={routes.productAdd} primary leftIcon={<FontAwesomeIcon icon={faPlus}></FontAwesomeIcon>}>
                        Thêm sản phẩm mới
                    </Button>
                </div>
                <div className="row">
                    <div className="col col-md-6">
                        <div className="row">
                            <div className="col col-md-6">
                                <Paragraph prefix="Mã sản phẩm: " value={product.product_id} />
                                <Paragraph prefix="Tên sản phẩm: " value={product.product_name} />
                                <Paragraph prefix="Số lượng: " value={product.product_stock_quantity} />
                                <Paragraph prefix="Số lượng đã bán: " value={product.product_sold_quantity} />
                                <Paragraph
                                    prefix="Giá bán: "
                                    value={Helper.formatMoney(parseInt(product.product_price)) + ' VNĐ'}
                                />
                            </div>
                            <div className="col col-md-6">
                                <Paragraph prefix="Ngày hết hạn: " value={product.product_expire_date} />
                                <Paragraph prefix="Danh mục: " value={product.category_name} />
                                <Paragraph prefix="Nhà cung cấp: " value={product.supplier_name} />
                                <Paragraph prefix="Mã giảm giá: " value={product.discount_code} />
                                <Paragraph prefix="Lần cập nhật gần nhất: " value={product.latest_update} />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col col-md-12">
                                <Paragraph prefix="Mô tả sản phẩm: " value={product.product_description} />
                            </div>
                        </div>
                    </div>
                    <div className="col col-md-6">
                        <ImageList title="Ảnh sản phẩm" images={images} />
                    </div>
                </div>
                <div className="text-center mt-5">
                    <Button
                        to={`/admin/products/${productId}/edit`}
                        warning
                        leftIcon={<FontAwesomeIcon icon={faPen} />}
                    >
                        Hiệu chỉnh
                    </Button>
                    <Button danger leftIcon={<FontAwesomeIcon icon={faTrashCan} />} onClick={() => confirmDeleteItem()}>
                        Xóa
                    </Button>
                </div>
            </div>

            <Button
                type="button"
                data-bs-toggle="modal"
                data-bs-target="#confirm-delete-product-modal"
                ref={openBtnRef}
            ></Button>
            <Modal
                id="confirm-delete-product-modal"
                title="Xác nhận xóa sản phẩm"
                buttons={[
                    {
                        type: 'secondary',
                        text: 'Hủy',
                        dismiss: 'modal',
                    },
                    {
                        type: 'primary',
                        text: 'Đồng ý',
                        onClick: () => handleDeleteItem,
                        dismiss: 'modal',
                    },
                ]}
            >
                <p>
                    Bạn có chắc chắn muốn xóa sản phẩm <strong>{product.product_name}</strong> ?
                </p>
            </Modal>
        </div>
    );
};

export default ProductDetail;
