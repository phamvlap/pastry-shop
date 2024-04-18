import { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as faFilledStar } from '@fortawesome/free-solid-svg-icons';
import { faStar } from '@fortawesome/free-regular-svg-icons';
import { toast } from 'react-toastify';

import { Button, InputGroup } from '~/components/index.js';
import { UserContext } from '~/contexts/UserContext.jsx';
import RatingActions from '~/utils/ratingActions.js';

import styles from './ReviewForm.module.scss';

const cx = classNames.bind(styles);

const ReviewForm = ({ item, setIsAddedReview }) => {
    const [form, setForm] = useState({});
    const [errors, setErrors] = useState({});
    const [star, setStar] = useState(0);
    const [starIcons, setStarIcons] = useState([]);

    const { user } = useContext(UserContext);

    const handleChange = (event) => {
        setForm({
            ...form,
            [event.target.name]: event.target.value,
        });
        setErrors({});
    };
    const handleChangeStar = (numberOfStars) => {
        setStar(numberOfStars);
        setForm({
            ...form,
            ['rating_star']: numberOfStars,
        });
    };
    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!form.rating_content || form.rating_content.length < 10) {
            setErrors({
                ...errors,
                rating_content: 'Nội dung dánh giá tối thiểu 10 ký tự',
            });
            return;
        }
        if (!user) {
            toast.error('Vui lòng đăng nhập để đánh giá sản phẩm');
            return;
        }
        const data = {
            product_id: item.product_id,
            rating_star: star,
            rating_content: form.rating_content,
        };
        await RatingActions.addRating(data);
        setIsAddedReview(true);
        setForm({});
        setStar(0);
    };
    useEffect(() => {
        let stars = [];
        for (let i = 0; i < 5; i++) {
            if (i < star) {
                stars.push(faFilledStar);
            } else {
                stars.push(faStar);
            }
        }
        setStarIcons(stars);
    }, [star]);

    return (
        <div className={cx('review-form-container')}>
            <h2 className={cx('review-form-title')}>Viết đánh giá của bạn</h2>
            <form className={cx('review-form__form')} onSubmit={(event) => handleSubmit(event)}>
                <label className={cx('review-form__label')}>Đánh giá:</label>
                <div className={cx('review-form__input-star')}>
                    {starIcons.map((icon, index) => {
                        return <FontAwesomeIcon key={index} icon={icon} onClick={() => handleChangeStar(index + 1)} />;
                    })}
                </div>
                <InputGroup
                    label="Nội dung"
                    name="rating_content"
                    type="textarea"
                    rows={3}
                    value={form.rating_content}
                    onChange={(event) => handleChange(event)}
                    error={errors.rating_content}
                />
                <div className={cx('review-form-btn')}>
                    <Button primary>
                        <span>Gửi</span>
                    </Button>
                </div>
            </form>{' '}
        </div>
    );
};

ReviewForm.propTypes = {
    item: PropTypes.object,
    setIsAddedReview: PropTypes.func,
};

export default ReviewForm;
