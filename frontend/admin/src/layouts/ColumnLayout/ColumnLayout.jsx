import PropTypes from 'prop-types';
import classNames from 'classnames/bind';

import styles from '~/layouts/ColumnLayout/ColumnLayout.module.scss';

const cx = classNames.bind(styles);

const ColumnLayout = ({ className = '', sides = [] }) => {
    const classNames = {
        [`row ${className}`]: true,
        container: !className.includes('height'),
    };
    return (
        <div className={cx(classNames)}>
            {sides.map((side, index) => {
                const sideClass = cx(`col col-md-${side.columns}`, {
                    [side.className]: side.className,
                });
                return (
                    <div key={index} className={sideClass}>
                        {side.element}
                    </div>
                );
            })}
        </div>
    );
};

ColumnLayout.propTypes = {
    sides: PropTypes.arrayOf(PropTypes.object),
    className: PropTypes.string,
};

export default ColumnLayout;
