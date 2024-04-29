import { useEffect, useState, useContext } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

import { CartContext } from '~/contexts/CartContext.jsx';
import Helper from '~/utils/helper.js';
import CartActions from '~/utils/cartActions.js';

import styles from './CartItem.module.scss';

const cx = classNames.bind(styles);

const CartItem = ({ cartItem, setCart }) => {
    const [quantity, setQuantity] = useState(cartItem.quantityInCart);
    const [isSelected, setIsSelected] = useState(!!cartItem.statusItem);

    const { setQuantityInCart } = useContext(CartContext);

    const currentPrice =
        Number(cartItem.product.price.price_value) -
        (Number(cartItem.product.price.price_value) * Number(cartItem.product.discount.discount_rate)) / 100;

    const updateCartItem = async () => {
        const data = {
            product_id: cartItem.product.product_id,
            cart_quantity: quantity,
            cart_is_selected: Number(isSelected),
        };
        await CartActions.updateItem(cartItem.product.product_id, data);
    };

    const handleDecreaseQuantity = () => {
        if (quantity > 1) {
            setQuantity((oldQuantity) => oldQuantity - 1);
            setQuantityInCart((oldQuantity) => oldQuantity - 1);
        }
    };
    const handleIncreaseQuantity = () => {
        setQuantity((oldQuantity) => oldQuantity + 1);
        setQuantityInCart((oldQuantity) => oldQuantity + 1);
    };
    const handleChangeSelectInput = (event) => {
        setIsSelected(event.target.checked);
        setCart((cart) =>
            cart.map((item) =>
                item.product.product_id === cartItem.product.product_id
                    ? { ...item, statusItem: event.target.checked }
                    : item,
            ),
        );
    };
    const handleRemoveItem = async () => {
        const key = cartItem.product.product_id;
        const oldQuantity = cartItem.quantityInCart;
        await CartActions.removeItem(key);
        setQuantityInCart((oldQuantityInCart) => oldQuantityInCart - oldQuantity);
        setCart((cart) => cart.filter((item) => item.product.product_id !== key));
    };

    useEffect(() => {
        updateCartItem();
    }, [quantity, isSelected]);

    useEffect(() => {
        setCart((cart) => {
            return cart.map((item) => {
                if (item.product.product_id === cartItem.product.product_id) {
                    return {
                        ...item,
                        quantityInCart: quantity,
                    };
                } else {
                    return item;
                }
            });
        });
    }, [quantity]);

    return (
        <div className={cx('cart-item-container')}>
            <div className="row">
                <div className="col col-md-1">
                    <div className={cx('cart-item__select')}>
                        <input
                            type="checkbox"
                            name=""
                            onChange={(event) => handleChangeSelectInput(event)}
                            checked={!!isSelected}
                        />
                    </div>
                </div>
                <div className="col col-md-6">
                    <div className={cx('cart-item__info')}>
                        <div className={cx('cart-item__image')}>
                            <img src={Helper.formatImageUrl(cartItem.product.images[0].image_url)} alt="Product" />
                        </div>
                        <div className={cx('cart-item__detail')}>
                            <div className={cx('cart-item__name')}>{cartItem.product.product_name}</div>
                            <div className={cx('cart-item__category')}>
                                <span>Danh mục:</span>
                                <span>{cartItem.product.category.category_name}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col col-md-2">
                    <div className={cx('cart-item__price')}>
                        <p className={cx('cart-item__price-item')}>
                            <span>{Helper.formatMoney(currentPrice)}</span>
                            <span>VNĐ</span>
                        </p>
                        <p className={cx('cart-item__price-item')}>
                            <span>{Helper.formatMoney(Number(cartItem.product.price.price_value))}</span>
                            <span>VNĐ</span>
                        </p>
                    </div>
                </div>
                <div className="col col-md-2">
                    <div className={cx('cart-item__actions')}>
                        <div className={cx('cart-item__action-edit-quantity')}>
                            <button onClick={() => handleDecreaseQuantity()}>-</button>
                            <input type="text" value={quantity} onChange={() => {}} />
                            <button onClick={() => handleIncreaseQuantity()}>+</button>
                        </div>
                    </div>
                </div>
                <div className="col col-md-1">
                    <div className={cx('cart-item__delete')}>
                        <button onClick={() => handleRemoveItem()}>
                            <FontAwesomeIcon icon={faTrash} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

CartItem.propTypes = {
    cartItem: PropTypes.object,
    setCart: PropTypes.func,
};

export default CartItem;
