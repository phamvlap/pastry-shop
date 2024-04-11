import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as faFilledStar } from '@fortawesome/free-solid-svg-icons';
import { faStar, faHeart } from '@fortawesome/free-regular-svg-icons';

import Helper from '~/utils/helper.js';

import styles from '~/components/ReviewItem/ReviewItem.module.scss';

const cx = classNames.bind(styles);

const ReviewItem = ({ review }) => {
    let starIcons = [];
    for (let i = 0; i < 5; i++) {
        if (i < Number(review.rating_star)) {
            starIcons.push(faFilledStar);
        } else {
            starIcons.push(faStar);
        }
    }

    return (
        <div className={cx('review-container')}>
            <div className="row">
                <div className="col col-md-2">
                    <div className={cx('review-image__container')}>
                        <img
                            className={cx('review-image')}
                            src={
                                review.customer.customer_avatar &&
                                Helper.formatImageUrl(review.customer.customer_avatar.image_url)
                            }
                            alt="customer"
                        />
                    </div>
                </div>
                <div className="col col-md-10">
                    <div className={cx('review-header')}>
                        <div className={cx('review-header__name')}>{review.customer.customer_name}</div>
                        <div className={cx('review-header__star')}>
                            {starIcons.map((icon, index) => {
                                return <FontAwesomeIcon key={index} icon={icon} />;
                            })}
                        </div>
                        <div className={cx('review-header__created-day')}>
                            {Helper.formatDateTime(review.rating_created_at)}
                        </div>
                    </div>
                    <div className={cx('review-body')}>{review.rating_content}</div>
                    <div className={cx('review-footer')}>
                        <p className={cx('review-footer__love')}>
                            <span className={cx('review-footer__love-icon')}>
                                <FontAwesomeIcon icon={faHeart} />
                            </span>

                            <span className={cx('review-footer__love-count')}>0</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

ReviewItem.propTypes = {
    review: PropTypes.object,
};

export default ReviewItem;
