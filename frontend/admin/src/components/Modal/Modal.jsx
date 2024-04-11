import PropTypes from 'prop-types';
import classNames from 'classnames/bind';

import styles from './Modal.module.scss';

const cx = classNames.bind(styles);

const Modal = ({ modalId = '', modalContent = '' }) => {
    return (
        <div
            className="modal fade"
            id={modalId}
            data-bs-backdrop="static"
            data-bs-keyboard="false"
            tabIndex="-1"
            aria-labelledby="staticBackdropLabel"
            aria-hidden="true"
        >
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className={cx('modal-title', 'title')} id="staticBackdropLabel">
                            {modalContent.title}
                        </h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className={cx('modal-body', 'body')}>
                        <div>{modalContent.body}</div>
                    </div>
                    <div className={cx('modal-footer', 'footer')}>{modalContent.footer}</div>
                </div>
            </div>
        </div>
    );
};

Modal.propTypes = {
    modalId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    modalContent: PropTypes.oneOfType([PropTypes.element, PropTypes.string, PropTypes.object]),
};

export default Modal;
