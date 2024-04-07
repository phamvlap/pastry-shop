import classNames from 'classnames/bind';
import PropTypes from 'prop-types';

import styles from '~/components/InputCheckbox/InputCheckbox.module.scss';

const cx = classNames.bind(styles);

const InputCheckbox = ({ label, name, id, value, checked, onChange, disabled = false }) => {
    return (
        <div className={cx('form-check', 'form-check-container')}>
            <input
                type="checkbox"
                value={value}
                name={name}
                id={id}
                checked={checked}
                onChange={onChange}
                className={cx('form-check__input')}
                disabled={disabled}
            />
            <label className={cx('form-check-label', 'form-check__label')} htmlFor={id}>
                {label}
            </label>
        </div>
    );
};

InputCheckbox.propTypes = {
    label: PropTypes.string,
    name: PropTypes.string,
    id: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    checked: PropTypes.bool,
    onChange: PropTypes.func,
    disabled: PropTypes.bool,
};

export default InputCheckbox;
