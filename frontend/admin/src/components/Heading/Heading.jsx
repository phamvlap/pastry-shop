import PropTypes from 'prop-types';
import classNames from 'classnames/bind';

import styles from '~/components/Heading/Heading.module.scss';

const cx = classNames.bind(styles);

const Heading = ({ title }) => {
    return <h1 className={cx('wrapper')}>{title}</h1>;
};

Heading.propTypes = {
    title: PropTypes.string,
};

export default Heading;
