import className from 'classnames/bind';
import PropTypes from 'prop-types';

import Helper from '~/utils/helper.js';

import styles from './OrderItem.module.scss';

const cx = className.bind(styles);

const OrderItem = ({ item }) => {
    return (
        <div className={cx('content-row')}>
            <div className="row">
                <div className={cx('col col-md-1', 'content-row__column')}>{item.index}</div>
                <div className={cx('col col-md-5', 'content-row__column')}>
                    <div className={cx('item-info')}>
                        <img
                            src={Helper.formatImageUrl(item.imageSrc)}
                            alt="product"
                            className={cx('item-info__image')}
                        />
                        <span className={cx('item-info__name')}>{item.name}</span>
                    </div>
                </div>
                <div className={cx('col col-md-2', 'content-row__column')}>{Helper.formatMoney(item.price)}</div>
                <div className={cx('col col-md-2', 'content-row__column')}>{item.quantity}</div>
                <div className={cx('col col-md-2', 'content-row__column')}>
                    {Helper.formatMoney(item.price * item.quantity)}
                </div>
            </div>
        </div>
    );
};

OrderItem.propTypes = {
    item: PropTypes.object,
};

export default OrderItem;
