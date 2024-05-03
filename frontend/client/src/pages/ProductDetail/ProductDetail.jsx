import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';

import { Button, ReviewItem, ReviewForm } from '~/components/index.js';
import Helper from '~/utils/helper.js';
import ProductActions from '~/utils/productActions.js';
import ProductImage from './components/ProductImage.jsx';
import ProductInfo from './components/ProductInfo.jsx';
import routes from '~/config/routes.js';

import styles from './ProductDetail.module.scss';

const cx = classNames.bind(styles);

const ProductDetail = () => {
    const [product, setProduct] = useState(null);
    const [ratingList, setRatingList] = useState(null);
    const [isAddedReview, setIsAddedReview] = useState(false);

    const { id } = useParams();

    const fetchProduct = async () => {
        try {
            const response = await ProductActions.getById(id);
            if (response.status === 'success') {
                setProduct(response.data);
                setRatingList(response.data.ratings);
            }
        } catch (err) {
            setProduct(null);
            setRatingList(null);
        }
    };

    useEffect(() => {
        fetchProduct();
    }, [id, isAddedReview]);

    return (
        <div className={cx('container')}>
            <div className={cx('detail-wrapper')}>
                <div className={cx('detail-back')}>
                    <Button to={routes.products} link>
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
                                        'images',
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
                            {ratingList && ratingList.length > 0 ? (
                                ratingList.map((rating, index) => {
                                    return <ReviewItem key={index} review={rating} />;
                                })
                            ) : (
                                <div className={cx('detail-loading')}>Chưa có đánh giá nào.</div>
                            )}
                        </div>
                        <div className="col col-md-6">
                            <ReviewForm
                                item={Helper.extractObject(product, ['product_id'])}
                                setIsAddedReview={setIsAddedReview}
                            />
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
