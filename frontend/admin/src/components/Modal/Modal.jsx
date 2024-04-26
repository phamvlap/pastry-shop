import PropTypes from 'prop-types';
import classNames from 'classnames/bind';

import { Button } from '~/components/index.js';

import styles from './Modal.module.scss';

const cx = classNames.bind(styles);

const Modal = ({ id, title, children, buttons }) => {
    return (
        <div
            className="modal fade"
            id={id}
            data-bs-backdrop="static"
            data-bs-keyboard="false"
            tabIndex="-1"
            aria-hidden="true"
        >
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className={cx('modal-header', 'modal__header')}>
                        <h1 className={cx('modal-title', 'modal__title')}>{title}</h1>
                    </div>
                    <div className={cx('modal-body', 'modal__body')}>{children}</div>
                    <div className={cx('modal-footer', 'modal__footer')}>
                        {buttons &&
                            buttons.map((button, index) => {
                                const props = {
                                    [button.type]: true,
                                    onClick: button.onClick,
                                    'data-bs-dismiss': button.dismiss,
                                    ref: button.ref,
                                    hidden: button.hidden,
                                    to: button.to,
                                };
                                return (
                                    <Button key={index} {...props}>
                                        {button.text}
                                    </Button>
                                );
                            })}
                    </div>
                </div>
            </div>
        </div>
    );
};

Modal.propTypes = {
    id: PropTypes.string,
    title: PropTypes.string,
    children: PropTypes.node,
    buttons: PropTypes.array,
    onClose: PropTypes.func,
};

export default Modal;
