import className from 'classnames/bind';

import styles from '~/components/OrderItemList/OrderItemList.module.scss';

const cx = className.bind(styles);

const OrderItemList = () => {
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
                <div className={cx('content-row')}>
                    <div className="row">
                        <div className={cx('col col-md-1', 'content-row__column')}>1</div>
                        <div className={cx('col col-md-5', 'content-row__column')}>
                            <div className={cx('item-info')}>
                                <img
                                    src="https://via.placeholder.com/100"
                                    alt="product"
                                    className={cx('item-info__image')}
                                />
                                <span className={cx('item-info__name')}>Tên sản phẩm</span>
                            </div>
                        </div>
                        <div className={cx('col col-md-2', 'content-row__column')}>45000</div>
                        <div className={cx('col col-md-2', 'content-row__column')}>2</div>
                        <div className={cx('col col-md-2', 'content-row__column')}>90000</div>
                    </div>
                </div>
                <div className={cx('content-row')}>
                    <div className="row">
                        <div className={cx('col col-md-1', 'content-row__column')}>2</div>
                        <div className={cx('col col-md-5', 'content-row__column')}>
                            <div className={cx('item-info')}>
                                <img
                                    src="https://via.placeholder.com/100"
                                    alt="product"
                                    className={cx('item-info__image')}
                                />
                                <span className={cx('item-info__name')}>Tên sản phẩm 2</span>
                            </div>
                        </div>
                        <div className={cx('col col-md-2', 'content-row__column')}>45000</div>
                        <div className={cx('col col-md-2', 'content-row__column')}>2</div>
                        <div className={cx('col col-md-2', 'content-row__column')}>90000</div>
                    </div>
                </div>
                <div className={cx('content-row')}>
                    <div className="row">
                        <div className={cx('col col-md-1', 'content-row__column')}>3</div>
                        <div className={cx('col col-md-5', 'content-row__column')}>
                            <div className={cx('item-info')}>
                                <img
                                    src="https://via.placeholder.com/100"
                                    alt="product"
                                    className={cx('item-info__image')}
                                />
                                <span className={cx('item-info__name')}>
                                    Tên sản phẩm 3Tên sản phẩm 3Tên sản phẩm 3Tên sản phẩm 3Tên sản phẩm 3Tên sản phẩm
                                    3Tên sản phẩm 3Tên sản phẩm 3Tên sản phẩm 3
                                </span>
                            </div>
                        </div>
                        <div className={cx('col col-md-2', 'content-row__column')}>45000</div>
                        <div className={cx('col col-md-2', 'content-row__column')}>2</div>
                        <div className={cx('col col-md-2', 'content-row__column')}>90000</div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default OrderItemList;
