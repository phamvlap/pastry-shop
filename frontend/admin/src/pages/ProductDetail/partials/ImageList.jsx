import PropTypes from 'prop-types';
import classNames from 'classnames/bind';

import styles from '~/pages/ProductDetail/ProductDetail.module.scss';

const cx = classNames.bind(styles);

const ImageList = ({ title, images = [] }) => {
    return (
        <>
            <h2 className={cx('image-section__title')}>{title}</h2>
            <div className={cx('row', 'image-section__image')}>
                {images.map((image, index) => {
                    return (
                        <div className={cx('col col-sm-4', 'image-section__item')} key={index}>
                            <img src={image.src} alt={image.alt} className={cx('image-item')} />
                        </div>
                    );
                })}
            </div>
        </>
    );
};

ImageList.propTypes = {
    title: PropTypes.string,
    images: PropTypes.array,
};

export default ImageList;
