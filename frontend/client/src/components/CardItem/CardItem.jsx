import { useContext } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as faFilledStar } from '@fortawesome/free-solid-svg-icons';
import { faStar } from '@fortawesome/free-regular-svg-icons';
import { toast } from 'react-toastify';

import { Button } from '~/components/index.js';
import Helper from '~/utils/helper.js';
import CartActions from '~/utils/cartActions.js';
import { UserContext } from '~/contexts/UserContext.jsx';
import { CartContext } from '~/contexts/CartContext.jsx';

import styles from './CardItem.module.scss';

const cx = classNames.bind(styles);

const CardItem = ({ product }) => {
    const { isLogged } = useContext(UserContext);
    const { setQuantityInCart } = useContext(CartContext);

    const ratingValue = Helper.averageRating(product.product_ratings);
    let starIcons = [];
    const currentPrice =
        product.product_price - (Number(product.product_price) * Number(product.product_discount.discount_rate)) / 100;
    for (let i = 0; i < 5; i++) {
        if (i < ratingValue) {
            starIcons.push(<FontAwesomeIcon key={i} icon={faFilledStar} />);
        } else {
            starIcons.push(<FontAwesomeIcon key={i} icon={faStar} />);
        }
    }

    const handleAddToCart = async () => {
        if (!isLogged) {
            toast.error('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng');
            return;
        }
        const data = {
            product_id: product.product_id,
            cart_quantity: 1,
            cart_is_selected: 0,
        };
        await CartActions.addItem(data);
        setQuantityInCart((prevQuantity) => prevQuantity + 1);
    };
    return (
        <div className={cx('card-container')}>
            <div className={cx('card-image')}>
                <Link to={`/product/${product.product_id}`}>
                    <img className={cx('card-image__item')} src={product.product_images[0].image_url} alt="product" />
                </Link>
            </div>
            <div className={cx('card-content')}>
                <Link to={`/product/${product.product_id}`}>
                    <h3 className={cx('card-title')}>{product.product_name}</h3>
                </Link>
                <div className={cx('card-price')}>
                    <div className={cx('card-price__original-container')}>
                        <p className={cx('card-price__original')}>
                            <span>{Helper.formatMoney(parseInt(product.product_price))}</span>
                            <span className={cx('card-price__unit-money')}>VNĐ</span>
                        </p>
                        {product.product_discount && (
                            <p className={cx('card-price__deducted-rate')}>
                                <span className="d-inline-block me-1">-</span>
                                <span className="d-inline-block me-1">
                                    {Number(product.product_discount.discount_rate)}
                                </span>
                                <span>%</span>
                            </p>
                        )}
                    </div>
                    <div className={cx('card-price__current')}>
                        <span>{Helper.formatMoney(currentPrice)}</span>
                        <span className={cx('card-price__unit-money')}>VNĐ</span>
                    </div>
                </div>
                <div className={cx('card-standout')}>
                    <div className={cx('card-standout__rating')}>
                        <span>
                            {starIcons.map((icon) => {
                                return icon;
                            })}
                        </span>
                        <span>{ratingValue}</span>
                    </div>
                    <div className={cx('card-standout__sold')}>
                        <span>{product.product_sold_quantity}</span>
                        <span>đã bán</span>
                    </div>
                </div>
                <div className={cx('card-button')}>
                    <Button outline onClick={() => handleAddToCart()}>
                        <span>Thêm vào giỏ</span>
                    </Button>
                </div>
            </div>
        </div>
    );
};

CardItem.propTypes = {
    product: PropTypes.object,
    setToasts: PropTypes.func,
};

export default CardItem;
