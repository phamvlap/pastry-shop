import PropTypes from 'prop-types';
import classNames from 'classnames/bind';

import styles from '~/components/FormSelect/FormSelect.module.scss';

const cx = classNames.bind(styles);

const FormSelect = ({ name, value, onChange, disabled, options, defaultOption = {} }) => {
    return (
        <select
            name={name}
            value={value}
            onChange={onChange}
            disabled={disabled}
            className={cx('form-select', 'container')}
        >
            {Object.keys(defaultOption).length > 0 && (
                <option value={defaultOption.value} className={cx('item')}>
                    {defaultOption.name}
                </option>
            )}
            {options.map((item, index) => {
                return (
                    <option key={index} value={item.value} className={cx('item')}>
                        {item.name}
                    </option>
                );
            })}
        </select>
    );
};

FormSelect.propTypes = {
    name: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onChange: PropTypes.func,
    disabled: PropTypes.bool,
    options: PropTypes.array,
    defaultOption: PropTypes.object,
};

export default FormSelect;
