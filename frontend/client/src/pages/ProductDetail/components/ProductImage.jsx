import classNames from 'classnames/bind';

import styles from '~/pages/ProductDetail/ProductDetail.module.scss';

const cx = classNames.bind(styles);

const ProductImage = () => {
    return (
        <div className={cx('image-wrapper')}>
            <div className="row">
                <div className="col col-md-3">
                    <div className={cx('list')}>
                        <div className={cx('list-item')}>
                            <img
                                src="./../../src/assets/images/cakes/cake_1.jpeg"
                                alt="Product"
                                className={cx('list__thumb-image')}
                            />
                        </div>
                        <div className={cx('list-item')}>
                            <img
                                src="./../../src/assets/images/cakes/cake_1.jpeg"
                                alt="Product"
                                className={cx('list__thumb-image')}
                            />
                        </div>
                        <div className={cx('list-item')}>
                            <img
                                src="./../../src/assets/images/cakes/cake_1.jpeg"
                                alt="Product"
                                className={cx('list__thumb-image')}
                            />
                        </div>
                        <div className={cx('list-item')}>
                            <img
                                src="./../../src/assets/images/cakes/cake_1.jpeg"
                                alt="Product"
                                className={cx('list__thumb-image')}
                            />
                        </div>
                    </div>
                </div>
                <div className="col col-md-9">
                    <div className={cx('single')}>
                        <img
                            src="./../../src/assets/images/cakes/cake_1.jpeg"
                            alt="Product"
                            className={cx('curr-image')}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductImage;
