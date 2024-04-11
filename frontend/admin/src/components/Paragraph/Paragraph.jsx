import PropTypes from 'prop-types';
import classNames from 'classnames/bind';

import styles from './Paragraph.module.scss';

const cx = classNames.bind(styles);

const Paragraph = ({ prefix, value = '', suffix }) => {
    return (
        <p className={cx('container')}>
            {prefix && <span className={cx('text')}>{prefix}</span>}
            {value}
            {suffix && <span className={cx('text')}>{suffix}</span>}
        </p>
    );
};

Paragraph.propTypes = {
    prefix: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    suffix: PropTypes.string,
};

export default Paragraph;
