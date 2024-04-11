import PropTypes from 'prop-types';
import classNames from 'classnames/bind';

import { InputItem, FormSelect, InputTextarea } from '~/components/index.js';

import styles from './InputGroup.module.scss';

const cx = classNames.bind(styles);

const InputGroup = ({
    label,
    type = 'text',
    name = '',
    value = '',
    onChange,
    error = '',
    placeholder = '',
    options = [],
    rows = 2,
    disabled = false,
    defaultOption = {},
    multiple = false,
}) => {
    return (
        <div className={cx('form-group my-3', 'container')}>
            {label && <label className={cx('fw-bold mb-3')}>{label}:</label>}
            {type === 'select' ? (
                <FormSelect
                    name={name}
                    value={value}
                    onChange={onChange}
                    className={cx('form-control', 'container', 'input')}
                    disabled={disabled}
                    options={options}
                    defaultOption={defaultOption}
                />
            ) : type === 'textarea' ? (
                <InputTextarea
                    name={name}
                    value={value}
                    rows={rows}
                    onChange={onChange}
                    className={cx('form-control', 'container', 'input')}
                    placeholder={placeholder}
                    disabled={disabled}
                />
            ) : (
                <InputItem
                    type={type}
                    name={name}
                    value={value}
                    onChange={onChange}
                    className={cx('form-control', 'container', 'input')}
                    placeholder={placeholder}
                    disabled={disabled}
                    multiple={multiple}
                />
            )}
            {error && <p className={cx('error')}>{error}</p>}
        </div>
    );
};

InputGroup.propTypes = {
    label: PropTypes.string,
    type: PropTypes.string,
    name: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onChange: PropTypes.func,
    error: PropTypes.string,
    placeholder: PropTypes.string,
    options: PropTypes.array,
    rows: PropTypes.number,
    disabled: PropTypes.bool,
    defaultOption: PropTypes.object,
    multiple: PropTypes.bool,
};

export default InputGroup;
