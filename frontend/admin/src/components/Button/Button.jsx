/* eslint-disable react/prop-types */
import { useRef, forwardRef, useImperativeHandle } from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames/bind';
// import PropTypes from 'prop-types';

import styles from './Button.module.scss';

const cx = classNames.bind(styles);

function Button(
    {
        to,
        href,
        primary = false,
        secondary = false,
        outline = false,
        text = false,
        success = false,
        warning = false,
        danger = false,
        rounded,
        disabled = false,
        small = false,
        large = false,
        children,
        className,
        leftIcon,
        rightIcon,
        onClick,
        ...passProps
    },
    ref,
) {
    let Comp = 'button';
    const buttonRef = useRef();

    const props = {
        onClick,
        ...passProps,
    };
    if (to) {
        // internal link
        props.to = to;
        Comp = Link;
    } else if (href) {
        // external link
        props.href = href;
        Comp = 'a';
    }

    // remove event listener when button disabled
    if (disabled) {
        Object.keys(props).forEach((key) => {
            if (key.startsWith('on') && typeof props[key] === 'function') delete props[key];
        });
    }

    const classes = cx('wrapper', {
        [className]: className,
        primary,
        secondary,
        outline,
        success,
        warning,
        danger,
        text,
        disabled,
        rounded,
        small,
        large,
    });

    useImperativeHandle(ref, () => ({
        click: () => buttonRef.current.click(),
    }));

    return (
        <Comp ref={buttonRef} className={classes} {...props}>
            {leftIcon && <span className={cx('icon')}>{leftIcon}</span>}
            <span className={cx('title')}>{children}</span>
            {rightIcon && <span className={cx('icon')}>{rightIcon}</span>}
        </Comp>
    );
}

// Button.propTypes = {
//     to: PropTypes.string,
//     href: PropTypes.string,
//     primary: PropTypes.bool,
//     secondary: PropTypes.bool,
//     outline: PropTypes.bool,
//     text: PropTypes.bool,
//     success: PropTypes.bool,
//     warning: PropTypes.bool,
//     danger: PropTypes.bool,
//     rounded: PropTypes.bool,
//     disabled: PropTypes.bool,
//     small: PropTypes.bool,
//     large: PropTypes.bool,
//     children: PropTypes.node.isRequired,
//     className: PropTypes.string,
//     leftIcon: PropTypes.node,
//     rightIcon: PropTypes.node,
//     onClick: PropTypes.func,
// };

const ForwardRefButton = forwardRef(Button);
export default ForwardRefButton;
