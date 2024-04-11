import PropTypes from 'prop-types';
import classNames from 'classnames/bind';

import styles from './InputTextarea.module.scss';

const cx = classNames.bind(styles);

const InputTextarea = ({ name, value, onChange, placeholder = '', rows = 2 }) => {
    return (
        <textarea
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            rows={rows}
            className={cx('form-control', 'input')}
        ></textarea>
    );
};

InputTextarea.propTypes = {
    name: PropTypes.string,
    value: PropTypes.string,
    onChange: PropTypes.func,
    placeholder: PropTypes.string,
    rows: PropTypes.number,
};

export default InputTextarea;
