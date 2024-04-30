import { useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';

import { Modal, Button } from '~/components/index.js';
import UserActions from '~/utils/userActions.js';
import { UserContext } from '~/contexts/UserContext.jsx';
import routes from '~/config/routes.js';

import styles from './Logout.module.scss';

const cx = classNames.bind(styles);

const Logout = ({ className, id }) => {
    const { setUser, setToken, setIsLogged } = useContext(UserContext);
    const openBtnRef = useRef(null);
    const navigate = useNavigate();

    const handleShowConfirmLogout = () => {
        openBtnRef.current.click();
    };
    const handleLogout = () => {
        UserActions.logout();
        setUser(null);
        setToken('');
        setIsLogged(false);
        toast.success('Đăng xuất thành công', {
            duration: 1000,
            onClose: () => [
                navigate(routes.origin, {
                    replace: true,
                }),
            ],
        });
    };
    return (
        <>
            <div
                className={cx('logout-container', {
                    [className]: true,
                })}
                onClick={() => handleShowConfirmLogout()}
            >
                <FontAwesomeIcon icon={faArrowRightFromBracket} />
                <span>Đăng xuất</span>
            </div>

            <Button ref={openBtnRef} data-bs-toggle="modal" data-bs-target={`#${id}`} hidden />
            <Modal
                id={id}
                title="Xác nhận đăng xuất"
                buttons={[
                    {
                        type: 'secondary',
                        dismiss: 'modal',
                        text: 'Hủy',
                    },
                    {
                        type: 'primary',
                        text: 'Đồng ý',
                        dismiss: 'modal',
                        onClick: () => handleLogout(),
                    },
                ]}
            >
                <p>Bạn có chắc chắn muốn đăng xuất khỏi website?</p>
            </Modal>
        </>
    );
};

Logout.propTypes = {
    className: PropTypes.string,
    id: PropTypes.string,
};

export default Logout;
