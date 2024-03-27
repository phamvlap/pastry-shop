import classNames from 'classnames/bind';
import PropTypes from 'prop-types';

import styles from '~/components/Wrapper/Wrapper.module.scss';

const cx = classNames.bind(styles);

const Wrapper = ({ children, padding = 8, colorLevel = 'white' }) => {
    const containerClass = cx('container', {
        [`padding-${padding}`]: padding,
        [`background-${colorLevel}-level`]: colorLevel,
    });
    return <div className={containerClass}>{children}</div>;
};

Wrapper.propTypes = {
    children: PropTypes.object.isRequired,
    padding: PropTypes.number,
    colorLevel: PropTypes.string,
};

export default Wrapper;
