import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faTrashCan, faChevronLeft, faPlus } from '@fortawesome/free-solid-svg-icons';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames/bind';
import Swal from 'sweetalert2';

import ColumnLayout from '~/layouts/ColumnLayout/ColumnLayout.jsx';
import ImageList from '~/pages/ProductDetail/partials/ImageList.jsx';
import { Heading, Wrapper, Button, Paragraph } from '~/components/index.js';
import { formatDate, staffActions } from '~/utils/index.js';

import styles from '~/pages/ProductDetail/ProductDetail.module.scss';

import { ProductService } from '~/services/index.js';

const cx = classNames.bind(styles);

const uploadProductsDir = import.meta.env.VITE_UPLOAD_PRODUCTS_DIR;
const configApi = {
    headers: {
        authorization: `Bearer ${staffActions.getToken()}`,
    },
};

const Content = ({ productId }) => {
    const [product, setProduct] = useState({});
    const [images, setImages] = useState([]);

    const productService = new ProductService(configApi);
    const navigate = useNavigate();

    const fetchProduct = async () => {
        try {
            const response = await productService.get(productId);
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
            const imageList = data.product_images.split(';').map((image) => {
                return {
                    src: `${uploadProductsDir}/${image}`,
                };
            });
            setProduct(item);
            setImages(imageList);
        } catch (error) {
            console.error(error);
        }
    };
    useEffect(() => {
        fetchProduct();
    }, []);

    const handleDeleteItem = () => {
        Swal.fire({
            title: `Bạn có chắc chắn muốn xóa sản phẩm ${product.product_name} ?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Xác nhận',
            cancelButtonText: 'Hủy',
        }).then(async (result) => {
            if (result.isConfirmed) {
                await productService.delete(productId).then(() => {
                    Swal.fire({
                        title: 'Xóa thành công',
                        icon: 'success',
                        showConfirmButton: false,
                        timer: 1500,
                    });
                    setTimeout(() => {
                        navigate('/products');
                    }, 1500);
                });
            }
        });
    };

    return (
        <div>
            <Heading title="Chi tiết sản phẩm" />
            <div className="mt-3">
                <div className={cx('control-bar')}>
                    <Button to="/products" outline leftIcon={<FontAwesomeIcon icon={faChevronLeft} />}>
                        Quay lại
                    </Button>
                    <Button to="/products/add" primary leftIcon={<FontAwesomeIcon icon={faPlus}></FontAwesomeIcon>}>
                        Thêm sản phẩm mới
                    </Button>
                </div>
                <Wrapper padding={8} colorLevel="fourth">
                    <>
                        <ColumnLayout
                            className={cx('mt-3', 'row-wrapper')}
                            sides={[
                                {
                                    columns: 6,
                                    element: (
                                        <>
                                            <ColumnLayout
                                                className={cx('row-wrapper')}
                                                sides={[
                                                    {
                                                        columns: 6,
                                                        element: (
                                                            <>
                                                                <Paragraph
                                                                    prefix="Mã sản phẩm: "
                                                                    value={product.product_id}
                                                                />
                                                                <Paragraph
                                                                    prefix="Tên sản phẩm: "
                                                                    value={product.product_name}
                                                                />
                                                                <Paragraph
                                                                    prefix="Số lượng: "
                                                                    value={product.product_stock_quantity}
                                                                />
                                                                <Paragraph
                                                                    prefix="Số lượng đã bán: "
                                                                    value={product.product_sold_quantity}
                                                                />
                                                                <Paragraph
                                                                    prefix="Giá bán: "
                                                                    value={product.product_price}
                                                                />
                                                            </>
                                                        ),
                                                    },
                                                    {
                                                        columns: 6,
                                                        element: (
                                                            <>
                                                                <Paragraph
                                                                    prefix="Ngày hết hạn: "
                                                                    value={product.product_expire_date}
                                                                />
                                                                <Paragraph
                                                                    prefix="Danh mục: "
                                                                    value={product.category_name}
                                                                />
                                                                <Paragraph
                                                                    prefix="Nhà cung cấp: "
                                                                    value={product.supplier_name}
                                                                />
                                                                <Paragraph
                                                                    prefix="Mã giảm giá: "
                                                                    value={product.discount_code}
                                                                />
                                                                <Paragraph
                                                                    prefix="Lần cập nhật gần nhất: "
                                                                    value={product.latest_update}
                                                                />
                                                            </>
                                                        ),
                                                    },
                                                ]}
                                            />
                                            <ColumnLayout
                                                className={cx('row-wrapper')}
                                                sides={[
                                                    {
                                                        columns: 12,
                                                        element: (
                                                            <Paragraph
                                                                prefix="Mô tả sản phẩm: "
                                                                value={product.product_description}
                                                            />
                                                        ),
                                                    },
                                                ]}
                                            />
                                        </>
                                    ),
                                },
                                {
                                    columns: 6,
                                    element: <ImageList title="Ảnh sản phẩm" images={images} />,
                                },
                            ]}
                        />
                        <div className="text-center mt-5">
                            <Button
                                to={`/products/${productId}/edit`}
                                warning
                                leftIcon={<FontAwesomeIcon icon={faPen} />}
                            >
                                Hiệu chỉnh
                            </Button>
                            <Button
                                danger
                                leftIcon={<FontAwesomeIcon icon={faTrashCan} />}
                                onClick={() => handleDeleteItem()}
                            >
                                Xóa
                            </Button>
                        </div>
                    </>
                </Wrapper>
            </div>
        </div>
    );
};

Content.propTypes = {
    productId: PropTypes.string,
};

export default Content;
