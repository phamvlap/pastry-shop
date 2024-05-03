import { useState } from 'react';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';

import Helper from '~/utils/helper.js';

import styles from './../ProductDetail.module.scss';

const cx = classNames.bind(styles);

const ProductImage = ({ images }) => {
    const [activeImage, setActiveImage] = useState(0);

    return (
        <div className={cx('image-wrapper')}>
            <div className="row">
                <div className="col col-md-3">
                    <div className={cx('list')}>
                        {images.length > 0 &&
                            images.map((image, index) => {
                                return (
                                    <div className={cx('list-item')} key={index} onClick={() => setActiveImage(index)}>
                                        <img
                                            src={Helper.formatImageUrl(image.image_url)}
                                            alt="Product"
                                            className={cx('list__thumb-image')}
                                        />
                                    </div>
                                );
                            })}
                    </div>
                </div>
                <div className="col col-md-9">
                    <div className={cx('single')}>
                        {images[activeImage] && (
                            <img
                                src={Helper.formatImageUrl(images[activeImage].image_url)}
                                alt="Product"
                                className={cx('curr-image')}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

ProductImage.propTypes = {
    images: PropTypes.array,
};

export default ProductImage;
