import PropTypes from 'prop-types';
import classNames from 'classnames/bind';

import styles from '~/components/InputSearch/InputSearch.module.scss';

const cx = classNames.bind(styles);

const InputSearch = () => {
    return (
        <div className={cx('wrapper')}>
            <div className={cx('container')}>
                <div className={cx('input-wrapper')}>
                    <input
                        type="text"
                        name="input-search"
                        className={cx('form-control', 'input-item')}
                        placeholder="Nhập tên sản phẩm..."
                    />
                </div>
                <div className={cx('btn-wrapper')}>
                    <span>Tìm kiếm</span>
                </div>
            </div>
        </div>
    );
};

InputSearch.propTypes = {
    placeholder: PropTypes.string,
};

export default InputSearch;
