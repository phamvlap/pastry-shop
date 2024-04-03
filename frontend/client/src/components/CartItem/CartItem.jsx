import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

import styles from '~/components/CartItem/CartItem.module.scss';

const cx = classNames.bind(styles);

const CartItem = () => {
    return (
        <div className={cx('cart-item-container')}>
            <div className="row">
                <div className="col col-md-1">
                    <div className={cx('cart-item__select')}>
                        <input type="checkbox" name="" id="" />
                    </div>
                </div>
                <div className="col col-md-7">
                    <div className={cx('cart-item__info')}>
                        <div className={cx('cart-item__image')}>
                            <img src="https://via.placeholder.com/100" alt="Product" />
                        </div>
                        <div className={cx('cart-item__detail')}>
                            <div className={cx('cart-item__name')}>Product Name</div>
                            <div className={cx('cart-item__price')}>
                                <span>100.000</span>
                                <span>VNĐ</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col col-md-2">
                    <div className={cx('cart-item__total')}>
                        <span>100.000</span>
                        <span>VNĐ</span>
                    </div>
                </div>
                <div className="col col-md-2">
                    <div className={cx('cart-item__actions')}>
                        <div className={cx('cart-item__action-edit-quantity')}>
                            <button>-</button>
                            <input type="text" value="2" onChange={() => {}} />
                            <button>+</button>
                        </div>
                        <div className={cx('cart-item__action--delete')}>
                            <button>
                                <FontAwesomeIcon icon={faTrash} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartItem;
