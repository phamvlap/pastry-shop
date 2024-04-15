import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as faFilledStar, faChevronRight, faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { faStar } from '@fortawesome/free-regular-svg-icons';

import { CardItem } from '~/components/index.js';
import Header from '~/layouts/partials/Header.jsx';
import Footer from '~/layouts/partials/Footer.jsx';
import ProductActions from '~/utils/productActions.js';
import RatingActions from '~/utils/ratingActions.js';

import styles from './Home.module.scss';

const cx = classNames.bind(styles);

const Home = () => {
    const [productList, setProductList] = useState(null);
    const [ratingList, setRatingList] = useState(null);
    const [currentReview, setCurrentReview] = useState(0);

    const fetchData = async () => {
        try {
            let response = await ProductActions.getAll({
                createdAtOrder: 'desc',
                limit: 4,
            });
            let data = [];
            if (response.status === 'success') {
                for (const row of response.data) {
                    data.push({
                        product_id: row.product_id,
                        product_name: row.product_name,
                        product_images: row.images.map((image) => {
                            return {
                                image_id: image.image_id,
                                image_url: `${import.meta.env.VITE_UPLOADED_DIR}${
                                    image.image_url.split('/uploads/')[1]
                                }`,
                            };
                        }),
                        product_stock_quantity: row.product_stock_quantity,
                        product_sold_quantity: row.product_sold_quantity,
                        product_price: row.price.price_value,
                        product_category: row.category,
                        product_discount: row.discount,
                        product_ratings: row.ratings,
                    });
                }
                setProductList(data);
            }
            response = await RatingActions.getAll({
                rating_star_sort: 'desc',
                limit: 10,
            });
            if (response.status === 'success') {
                setRatingList(response.data);
            }
        } catch (error) {
            setProductList([]);
            setRatingList([]);
        }
    };
    const handlePrevReview = (event) => {
        event.preventDefault();
        setCurrentReview((currentReview - 1 + ratingList.length) % ratingList.length);
    };
    const handleNextReview = (event) => {
        event.preventDefault();
        setCurrentReview((currentReview + 1) % ratingList.length);
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div>
            <Header />
            <div className={cx('home-banner')}>
                <img src="./src/assets/images/banner.jpg" alt="Banner" className={cx('home-banner__image')} />
                <div className={cx('home-banner__link')}>
                    <Link to="/products" className={cx('home-banner__link-item')}>
                        Bắt đầu khám phá
                    </Link>
                    <Link to="/register" className={cx('home-banner__link-item')}>
                        Đăng ký ngay
                    </Link>
                </div>
            </div>
            <div className="container">
                <div className={cx('home-new')}>
                    <h2 className={cx('home-title')}>Sản phẩm mới</h2>
                    <div className={cx('home-new__products')}>
                        {productList &&
                            productList.map((product) => {
                                return <CardItem key={product.product_id} product={product} />;
                            })}
                    </div>
                    <p className={cx('home-new__link')}>
                        <Link to="/products">Xem tất cả</Link>
                    </p>
                </div>
                <div className={cx('home-review')}>
                    <h2 className={cx('home-title')}>Đánh giá của khách hàng</h2>
                    <div className={cx('home-review__content')}>
                        {ratingList && (
                            <div className={cx('review-item')}>
                                <div className={cx('review-item__content')}>
                                    &quot;
                                    {ratingList[currentReview].rating_content}
                                    &quot;
                                </div>
                                <div className={cx('review-item__star')}>
                                    {Array.from(
                                        {
                                            length: 5,
                                        },
                                        (_, index) => {
                                            return (
                                                <FontAwesomeIcon
                                                    key={index}
                                                    icon={
                                                        index < ratingList[currentReview].rating_star
                                                            ? faFilledStar
                                                            : faStar
                                                    }
                                                />
                                            );
                                        },
                                    )}
                                </div>
                                <div className={cx('review-item__customer')}>
                                    <span className={cx('review-item__customer-label')}>Khách hàng -</span>
                                    <span className={cx('review-item__customer-name')}>
                                        {ratingList[currentReview].customer.customer_name}
                                    </span>
                                </div>
                            </div>
                        )}
                        <button className={cx('review-btn__left')} onClick={(event) => handlePrevReview(event)}>
                            <FontAwesomeIcon icon={faChevronLeft} />
                        </button>
                        <button className={cx('review-btn__right')} onClick={(event) => handleNextReview(event)}>
                            <FontAwesomeIcon icon={faChevronRight} />
                        </button>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Home;
