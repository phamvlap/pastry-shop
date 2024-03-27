import PropTypes from 'prop-types';
import classNames from 'classnames/bind';

import InputItem from '~/components/InputItem/InputItem.jsx';
import FormSelect from '~/components/FormSelect/FormSelect.jsx';
import InputTextarea from '~/components/InputTextarea/InputTextarea.jsx';
import styles from '~/components/InputGroup/InputGroup.module.scss';

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
}) => {
    return (
        <div className={containerClass}>
            {label && <label className={labelClass}>{label}:</label>}
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
};

export default InputGroup;
