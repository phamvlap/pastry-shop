import className from 'classnames/bind';
import PropTypes from 'prop-types';

import Helper from '~/utils/helper.js';
import styles from '~/components/OrderItemList/OrderItemList.module.scss';

const cx = className.bind(styles);

const OrderItemList = ({ itemList }) => {
    return (
        <>
            <h2 className={cx('title')}>Chi tiết đơn hàng</h2>
            <div className={cx('content')}>
                <div className={cx('content-row')}>
                    <div className="row">
                        <div className={cx('col col-md-1', 'content-row__column')}>##</div>
                        <div className={cx('col col-md-5', 'content-row__column')}>Sản phẩm</div>
                        <div className={cx('col col-md-2', 'content-row__column')}>Giá bán</div>
                        <div className={cx('col col-md-2', 'content-row__column')}>Số lượng</div>
                        <div className={cx('col col-md-2', 'content-row__column')}>Thành tiền</div>
                    </div>
                </div>
                {itemList.map((item, index) => {
                    const priceValue =
                        Number(item.detail.price.price_value) -
                        Number(item.detail.price.price_value) * Number(item.detail.discount.discount_rate);
                    return (
                        <div className={cx('content-row')} key={index}>
                            <div className="row">
                                <div className={cx('col col-md-1', 'content-row__column')}>{index + 1}</div>
                                <div className={cx('col col-md-5', 'content-row__column')}>
                                    <div className={cx('item-info')}>
                                        <img
                                            src={Helper.formatImageUrl(item.detail.images[0].image_url)}
                                            alt="product"
                                            className={cx('item-info__image')}
                                        />
                                        <span className={cx('item-info__name')}>{item.detail.product_name}</span>
                                    </div>
                                </div>
                                <div className={cx('col col-md-2', 'content-row__column')}>
                                    {Helper.formatMoney(priceValue)}
                                </div>
                                <div className={cx('col col-md-2', 'content-row__column')}>{item.quantityInCart}</div>
                                <div className={cx('col col-md-2', 'content-row__column')}>
                                    {Helper.formatMoney(priceValue * Number(item.quantityInCart))}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </>
    );
};

OrderItemList.propTypes = {
    itemList: PropTypes.array,
};

export default OrderItemList;
