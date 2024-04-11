import PropTypes from 'prop-types';
import classNames from 'classnames/bind';

import { Button } from '~/components/index.js';

import styles from './Form.module.scss';

const cx = classNames.bind(styles);

const Form = ({ title, buttons, onSubmit, errors, children, enctype = 'application/x-www-form-urlencoded' }) => {
    return (
        <form onSubmit={onSubmit} className={cx('container')} encType={enctype}>
            {title && <h2 className={cx('title')}>{title}</h2>}
            {errors.form && <p className={cx('error')}>{errors.form}</p>}
            {children}
            <div className={cx('button')}>
                {buttons.map((button, index) => {
                    let attributes = {
                        [button.type]: true,
                    };
                    if (button.onClick) {
                        attributes['onClick'] = button.onClick;
                    }
                    return (
                        <Button key={index} {...attributes}>
                            {button.name}
                        </Button>
                    );
                })}
            </div>
        </form>
    );
};

Form.propTypes = {
    title: PropTypes.string,
    buttons: PropTypes.array,
    onSubmit: PropTypes.func,
    form: PropTypes.object,
    errors: PropTypes.object,
    children: PropTypes.oneOfType([PropTypes.element, PropTypes.node]),
    enctype: PropTypes.string,
};

export default Form;
