import classNames from 'classnames/bind';
import PropTypes from 'prop-types';

import styles from '~/components/InputItem/InputItem.module.scss';

const cx = classNames.bind(styles);

const InputItem = ({ type = 'text', name, value, onChange, placeholder = '', disabled = false, multiple }) => {
    return (
        <input
            type={type}
            value={value}
            name={name}
            onChange={onChange}
            className={cx('form-control', 'input')}
            placeholder={placeholder}
            disabled={disabled}
            multiple={multiple}
        />
    );
};

InputItem.propTypes = {
    type: PropTypes.string,
    name: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onChange: PropTypes.func,
    placeholder: PropTypes.string,
    disabled: PropTypes.bool,
    multiple: PropTypes.bool,
};

export default InputItem;
