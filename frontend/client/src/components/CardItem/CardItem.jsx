import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as faFilledStar } from '@fortawesome/free-solid-svg-icons';
import { faStar } from '@fortawesome/free-regular-svg-icons';
import { Link } from 'react-router-dom';

import { Button } from '~/components/index.js';
import Helper from '~/utils/helper.js';
import CartActions from '~/utils/cartActions.js';

import styles from '~/components/CardItem/CardItem.module.scss';

const cx = classNames.bind(styles);

const CardItem = ({ product }) => {
    const ratingValue = Helper.averageRating(product.product_ratings);
    let starIcons = [];
    const currentPrice =
        product.product_price - Number(product.product_price) * Number(product.product_discount.discount_rate);
    for (let i = 0; i < 5; i++) {
        if (i < ratingValue) {
            starIcons.push(<FontAwesomeIcon key={i} icon={faFilledStar} />);
        } else {
            starIcons.push(<FontAwesomeIcon key={i} icon={faStar} />);
        }
    }

    const handleAddToCart = async () => {
        const data = {
            product_id: product.product_id,
            cart_quantity: 1,
            cart_is_selected: 0,
        };
        await CartActions.addItem(data);
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
                        <p className={cx('card-price__deducted-rate')}>
                            <span>-</span>
                            <span>{Number(product.product_discount.discount_rate) * 100}</span>
                            <span>%</span>
                        </p>
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
};

export default CardItem;
