import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
// import { faStar } from '@fortawesome/free-regular-svg-icons';

import styles from '~/components/CardItem/CardItem.module.scss';

const cx = classNames.bind(styles);

const CardItem = () => {
    return (
        <div className={cx('card-container')}>
            <div className={cx('card-image')}>
                <img
                    className={cx('card-image__item')}
                    src="./../../src/assets/images/cakes/cake_1.jpeg"
                    alt="product"
                />
            </div>
            <div className={cx('card-content')}>
                <h3 className={cx('card-title')}>Bánh pudding chuối Bánh pudding chuối Bánh pudding chuối</h3>
                <div className={cx('card-price')}>
                    <div className={cx('card-price__original-container')}>
                        <p className={cx('card-price__original')}>
                            <span>360000</span>
                            <span className={cx('card-price__unit-money')}>VNĐ</span>
                        </p>
                        <p className={cx('card-price__deducted-rate')}>
                            <span>-</span>
                            <span>50</span>
                            <span>%</span>
                        </p>
                    </div>
                    <div className={cx('card-price__current')}>
                        <span>360000</span>
                        <span className={cx('card-price__unit-money')}>VNĐ</span>
                    </div>
                </div>
                <div className={cx('card-standout')}>
                    <div className={cx('card-standout__rating')}>
                        <span>
                            <FontAwesomeIcon icon={faStar} />
                            <FontAwesomeIcon icon={faStar} />
                            <FontAwesomeIcon icon={faStar} />
                            <FontAwesomeIcon icon={faStar} />
                            <FontAwesomeIcon icon={faStar} />
                        </span>
                        <span>4.5</span>
                    </div>
                    <div className={cx('card-standout__sold')}>
                        <span>30</span>
                        <span>đã bán</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CardItem;
