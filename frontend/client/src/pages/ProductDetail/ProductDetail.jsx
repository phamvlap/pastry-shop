import classNames from 'classnames/bind';

import ProductImage from '~/pages/ProductDetail/components/ProductImage.jsx';
import ProductInfo from '~/pages/ProductDetail/components/ProductInfo.jsx';
import styles from '~/pages/ProductDetail/ProductDetail.module.scss';

const cx = classNames.bind(styles);

const ProductDetail = () => {
    return (
        <div className={cx('container')}>
            <div className={cx('detail-wrapper')}>
                <div className="row">
                    <div className="col col-md-6">
                        <ProductImage />
                        <div className={cx('description-wrapper')}>
                            <h3 className={cx('description-title')}>Thông tin sản phẩm</h3>
                            <p className={cx('description-content')}>
                                Bánh trái cây tươi là một loại bánh ngọt được làm từ các loại trái cây tươi như dâu,
                                nho, kiwi, dừa, xoài
                            </p>
                        </div>
                    </div>
                    <div className="col col-md-6">
                        <ProductInfo />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
