import PropTypes from 'prop-types';
import classNames from 'classnames/bind';

import styles from './FormSelect.module.scss';

const cx = classNames.bind(styles);

const FormSelect = ({ name, value, onChange, disabled, options, defaultOption = {}, className }) => {
    const classes = cx('form-select', 'container', className);
    return (
        <select name={name} value={value} onChange={onChange} disabled={disabled} className={classes}>
            {Object.keys(defaultOption).length > 0 && (
                <option
                    value={defaultOption.value}
                    className={cx('item')}
                    defaultValue={defaultOption.selected || false}
                >
                    {defaultOption.name}
                </option>
            )}
            {options.map((item, index) => {
                return (
                    <option key={index} value={item.value} className={cx('item')} defaultValue={item.selected || false}>
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
    className: PropTypes.string,
};

export default FormSelect;
