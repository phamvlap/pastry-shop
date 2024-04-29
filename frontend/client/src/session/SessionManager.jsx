import { useContext, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

import { UserContext } from '~/contexts/UserContext.jsx';
import UserActions from '~/utils/userActions.js';
import { Modal } from '~/components/index.js';
import routes from '~/config/routes.js';

const SessionManager = ({ children }) => {
    const { user, setUser, setToken, isLogged, setIsLogged } = useContext(UserContext);
    const navigate = useNavigate();
    const openBtnRef = useRef(null);
    const closeBtnRef = useRef(null);

    useEffect(() => {
        let timer = null;
        if (!isLogged) {
            navigate(routes.login);
        } else {
            timer = setTimeout(() => {
                confirmExpiredSession();
            }, Number(user.expiredAt) - new Date().getTime());
        }
        return () => {
            if (timer) {
                clearTimeout(timer);
            }
        };
    }, [user, isLogged]);

    const confirmExpiredSession = () => {
        openBtnRef.current.click();
    };
    const implementLogout = () => {
        UserActions.logout();
        setUser(null);
        setToken('');
        setIsLogged(false);
    };
    const navigateToHome = () => {
        closeBtnRef.current.click();
        navigate(routes.origin);
        implementLogout();
    };
    const navigateToLogin = () => {
        closeBtnRef.current.click();
        navigate(routes.login);
        implementLogout();
    };
    return (
        <>
            {children}
            <button ref={openBtnRef} data-bs-toggle="modal" data-bs-target="#expired-session-modal"></button>
            <Modal
                id="expired-session-modal"
                title="Phiên làm việc hết hạn"
                buttons={[
                    {
                        type: 'secondary',
                        dismiss: 'modal',
                        ref: closeBtnRef,
                        hidden: true,
                    },
                    {
                        type: 'primary',
                        text: 'Về trang chủ',
                        onClick: () => navigateToHome(),
                    },
                    {
                        type: 'outline',
                        text: 'Đăng nhập',
                        onClick: () => navigateToLogin(),
                    },
                ]}
            >
                <p>Phiên làm việc của bạn đã hết hạn, vui lòng đăng nhập lại để tiếp tục.</p>
            </Modal>
        </>
    );
};

SessionManager.propTypes = {
    children: PropTypes.node.isRequired,
};

export default SessionManager;
