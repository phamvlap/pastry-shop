import { useState } from 'react';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-regular-svg-icons';

import styles from './InputItem.module.scss';

const cx = classNames.bind(styles);

const InputItem = ({ type = 'text', name, value, onChange, placeholder = '', disabled = false, multiple }) => {
    const [currentIcon, setCurrentIcon] = useState(faEyeSlash);
    const [typeOfInput, setTypeOfInput] = useState(type);

    const handleChangeVisible = () => {
        if (typeOfInput === 'password') {
            setTypeOfInput('text');
            setCurrentIcon(faEye);
        } else {
            setTypeOfInput('password');
            setCurrentIcon(faEyeSlash);
        }
    };
    return type === 'password' ? (
        <div className={cx('input-item__password')}>
            <input
                type={typeOfInput}
                value={value}
                name={name}
                onChange={onChange}
                className={cx('form-control', 'input-item')}
                placeholder={placeholder}
                disabled={disabled}
                multiple={multiple}
            />
            <span className={cx('input-item__password-toggle')}>
                <span onClick={() => handleChangeVisible()}>
                    <FontAwesomeIcon icon={currentIcon} />
                </span>
            </span>
        </div>
    ) : (
        <input
            type={type}
            value={value}
            name={name}
            onChange={onChange}
            className={cx('form-control', 'input-item')}
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
