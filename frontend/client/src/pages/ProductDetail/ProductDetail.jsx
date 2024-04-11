import classNames from 'classnames/bind';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';

import { Button, ReviewItem, ReviewForm } from '~/components/index.js';
import Helper from '~/utils/helper.js';
import ProductActions from '~/utils/productActions.js';
import ProductImage from '~/pages/ProductDetail/components/ProductImage.jsx';
import ProductInfo from '~/pages/ProductDetail/components/ProductInfo.jsx';

import styles from '~/pages/ProductDetail/ProductDetail.module.scss';

const cx = classNames.bind(styles);

const ProductDetail = () => {
    const [product, setProduct] = useState(null);
    const { id } = useParams();

    const fetchProduct = async () => {
        const response = await ProductActions.getById(id);
        if (response.status === 'success') {
            setProduct(response.data);
        }
    };

    useEffect(() => {
        fetchProduct();
    }, [id]);
    // console.log(product);

    return (
        <div className={cx('container')}>
            <div className={cx('detail-wrapper')}>
                <div className={cx('detail-back')}>
                    <Button to="/" outline>
                        <FontAwesomeIcon icon={faChevronLeft} />
                        <span>Quay lại</span>
                    </Button>
                </div>
                <div className="row">
                    {product ? (
                        <>
                            <div className="col col-md-6">
                                <ProductImage images={product.images} />
                                <div className={cx('description-wrapper')}>
                                    <h3 className={cx('description-title')}>Thông tin sản phẩm</h3>
                                    <p className={cx('description-content')}>{product.product_description}</p>
                                </div>
                            </div>
                            <div className="col col-md-6">
                                <ProductInfo
                                    item={Helper.extractObject(product, [
                                        'product_id',
                                        'product_name',
                                        'product_description',
                                        'product_sold_quantity',
                                        'product_stock_quantity',
                                        'price',
                                        'category',
                                        'supplier',
                                        'discount',
                                        'ratings',
                                    ])}
                                />
                            </div>
                        </>
                    ) : (
                        <div className={cx('detail-loading')}>Đang tải dữ liệu...</div>
                    )}
                </div>
                <div className={cx('detail-review')}>
                    <h3 className={cx('detail-title')}>Đánh giá sản phẩm</h3>
                    <div className="row">
                        <div className="col col-md-6">
                            {product && product.ratings.length > 0 ? (
                                product.ratings.map((rating, index) => {
                                    return <ReviewItem key={index} review={rating} />;
                                })
                            ) : (
                                <div className={cx('detail-loading')}>Chưa có đánh giá nào</div>
                            )}
                        </div>
                        <div className="col col-md-6">
                            <ReviewForm item={Helper.extractObject(product, ['product_id'])} />
                        </div>
                    </div>
                </div>
                <div className={cx('detail-review')}>
                    <h3 className={cx('detail-title')}>Có thể bạn sẽ thích</h3>
                    <div className="row"></div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
