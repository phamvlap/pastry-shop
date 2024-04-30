import { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as faFilledStar } from '@fortawesome/free-solid-svg-icons';
import { faStar } from '@fortawesome/free-regular-svg-icons';
import { toast } from 'react-toastify';

import { UserContext } from '~/contexts/UserContext.jsx';
import { CartContext } from '~/contexts/CartContext.jsx';
import Helper from '~/utils/helper.js';
import CartActions from '~/utils/cartActions.js';
import { Button } from '~/components/index.js';

import styles from './../ProductDetail.module.scss';

const cx = classNames.bind(styles);

const ProductInfo = ({ item }) => {
    const [selectedQuantity, setSelectedQuantity] = useState(0);

    const { user } = useContext(UserContext);
    const { setQuantityInCart } = useContext(CartContext);

    const currentPrice =
        Number(item.price.price_value) - (Number(item.price.price_value) * Number(item.discount.discount_rate)) / 100;
    const ratingValue = Helper.averageRating(item.ratings);
    let starIcons = [];
    for (let i = 0; i < 5; i++) {
        if (i < ratingValue) {
            starIcons.push(<FontAwesomeIcon key={i} icon={faFilledStar} />);
        } else {
            starIcons.push(<FontAwesomeIcon key={i} icon={faStar} />);
        }
    }

    const handleIncreaseQuantity = () => {
        if (selectedQuantity < Number(item.product_stock_quantity) - Number(item.product_sold_quantity)) {
            setSelectedQuantity((oldQuantity) => oldQuantity + 1);
        }
    };
    const handleDecreaseQuantity = () => {
        if (selectedQuantity > 0) {
            setSelectedQuantity((oldQuantity) => oldQuantity - 1);
        }
    };
    const handleAddToCart = async () => {
        if (selectedQuantity === 0) {
            toast.error('Vui lòng chọn số lượng sản phẩm');
            return;
        }
        if (!user) {
            toast.error('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng');
            return;
        }
        const data = {
            product_id: item.product_id,
            cart_quantity: selectedQuantity,
            cart_is_selected: 0,
        };
        await CartActions.addItem(data);
        setQuantityInCart((oldQuantity) => oldQuantity + selectedQuantity);
        setSelectedQuantity(0);
    };
    // const handleToCheckout = () => {};
    return (
        <div className={cx('info-wrapper')}>
            <h2 className={cx('info-title')}>{item.product_name}</h2>
            <div className={cx('info-rating')}>
                <span className={cx('info-rating__icon')}>
                    {starIcons.map((icon) => {
                        return icon;
                    })}
                </span>
                <span className={cx('info-rating__value')}>{ratingValue}</span>
            </div>
            <div className={cx('info-category')}>
                <span className="fw-bold">Danh mục: </span>
                <span>{item?.category?.category_name}</span>
            </div>
            <div className={cx('info-price')}>
                <div className={cx('info-price__old')}>
                    <span>{Helper.formatMoney(Number(item.price.price_value))}</span>
                    <span>VNĐ</span>
                </div>
                <div className={cx('info-price__current')}>
                    <span>{Helper.formatMoney(currentPrice)}</span>
                    <span>VNĐ</span>
                </div>
                <div className={cx('info-price__discount')}>
                    <span className="d-inline-block me-1">-</span>
                    <span className="d-inline-block me-1">{Number(item.discount.discount_rate)}</span>
                    <span>%</span>
                </div>
            </div>
            <div className={cx('info-quantity')}>
                <span className={cx('info-quantity__label')}>Số lượng: </span>
                <div className={cx('info-quantity__buttons')}>
                    <button onClick={() => handleDecreaseQuantity()}>-</button>
                    <input type="text" value={selectedQuantity} readOnly />
                    <button onClick={() => handleIncreaseQuantity()}>+</button>
                </div>
                <div className={cx('info-quantity__avaiable')}>
                    <span>{Number(item.product_stock_quantity) - Number(item.product_sold_quantity)}</span>
                    <span>sản phẩm có sẵn</span>
                </div>
            </div>
            <div className={cx('info-order')}>
                <Button outline onClick={() => handleAddToCart()}>
                    Thêm vào giỏ hàng
                </Button>
                {/* <Button primary onClick={() => handleToCheckout()}>
                    Đặt hàng
                </Button> */}
            </div>
        </div>
    );
};

ProductInfo.propTypes = {
    item: PropTypes.object,
};

export default ProductInfo;
