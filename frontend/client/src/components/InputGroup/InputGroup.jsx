import PropTypes from 'prop-types';
import classNames from 'classnames/bind';

import { FormSelect, InputTextarea, InputItem, InputCheckbox } from '~/components/index.js';

import styles from './InputGroup.module.scss';

const cx = classNames.bind(styles);

const containerClass = cx('form-group my-3', 'container');
const inputClass = cx('form-control', 'container', 'input');
const labelClass = cx('fw-bold mb-3');

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
    checked,
}) => {
    return (
        <div className={containerClass}>
            {label && type !== 'checkbox' && <label className={labelClass}>{label}:</label>}
            {type === 'select' ? (
                <FormSelect
                    name={name}
                    value={value}
                    onChange={onChange}
                    className={inputClass}
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
                    className={inputClass}
                    placeholder={placeholder}
                    disabled={disabled}
                />
            ) : type === 'checkbox' ? (
                <InputCheckbox
                    label={label}
                    name={name}
                    value={value}
                    checked={checked}
                    onChange={onChange}
                    className={inputClass}
                    disabled={disabled}
                />
            ) : (
                <InputItem
                    type={type}
                    name={name}
                    value={value}
                    onChange={onChange}
                    className={inputClass}
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
    checked: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]),
};

export default InputGroup;
