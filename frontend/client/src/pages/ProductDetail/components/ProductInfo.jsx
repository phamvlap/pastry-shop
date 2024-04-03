// import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';

import Button from '~/components/Button/Button.jsx';
import styles from '~/pages/ProductDetail/ProductDetail.module.scss';

const cx = classNames.bind(styles);

const ProductInfo = () => {
    return (
        <div className={cx('info-wrapper')}>
            <h2 className={cx('info-title')}>Bánh trái cây tươi</h2>
            <div className={cx('info-rating')}>
                <span className={cx('info-rating__icon')}>
                    <FontAwesomeIcon icon={faStar} />
                    <FontAwesomeIcon icon={faStar} />
                    <FontAwesomeIcon icon={faStar} />
                    <FontAwesomeIcon icon={faStar} />
                    <FontAwesomeIcon icon={faStar} />
                </span>
                <span className={cx('info-rating__value')}>4.5</span>
            </div>
            <div className={cx('info-category')}>
                <span>Danh mục: </span>
                <span>Bánh trái cây</span>
            </div>
            <div className={cx('info-price')}>
                <div className={cx('info-price__old')}>
                    <span>120000</span>
                    <span>VNĐ</span>
                </div>
                <div className={cx('info-price__current')}>
                    <span>100000</span>
                    <span>VNĐ</span>
                </div>
                <div className={cx('info-price__discount')}>
                    <span>20</span>
                    <span>%</span>
                </div>
            </div>
            <div className={cx('info-quantity')}>
                <span className={cx('info-quantity__label')}>Số lượng: </span>
                <div className={cx('info-quantity__buttons')}>
                    <button>-</button>
                    <input type="text" value="2" onChange={() => {}} />
                    <button>+</button>
                </div>
                <div className={cx('info-quantity__avaiable')}>
                    <span>10</span>
                    <span>sản phẩm có sẵn</span>
                </div>
            </div>
            <div className={cx('info-order')}>
                <Button primary>Thêm vào giỏ hàng</Button>
                <Button primary>Đặt hàng</Button>
            </div>
        </div>
    );
};

export default ProductInfo;
