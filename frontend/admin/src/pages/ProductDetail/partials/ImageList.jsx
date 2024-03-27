import PropTypes from 'prop-types';
import classNames from 'classnames/bind';

import styles from '~/pages/ProductDetail/ProductDetail.module.scss';

const cx = classNames.bind(styles);

const ImageList = ({ title, images = [] }) => {
    return (
        <>
            <h2 className={cx('title')}>{title}</h2>
            <div className="row">
                {images.map((image, index) => {
                    return (
                        <div className="col col-sm-4" key={index}>
                            <img src={image.src} alt={image.alt} className={cx('image')} />
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
