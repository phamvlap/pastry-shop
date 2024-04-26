import { useContext, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

import { StaffContext } from '~/contexts/StaffContext.jsx';
import { staffActions } from '~/utils/index.js';
import { Modal } from '~/components/index.js';

const SessionManager = ({ children }) => {
    const { staff, setStaff, setToken, isAuthenticated, setIsAuthenticated } = useContext(StaffContext);
    const navigate = useNavigate();
    const openBtnRef = useRef(null);
    const closeBtnRef = useRef(null);

    useEffect(() => {
        let timer = null;
        if (!isAuthenticated) {
            navigate('/login');
        } else {
            navigate(window.location.pathname);
            timer = setTimeout(() => {
                openBtnRef.current.click();
            }, Number(staff.expiredAt) - new Date().getTime());
        }
        return () => {
            if (timer) {
                clearTimeout(timer);
            }
        };
    }, []);

    const handleAutoLogout = () => {
        staffActions.logOut();
        setStaff(null);
        setToken('');
        setIsAuthenticated(false);
    };
    const navigateToLogin = () => {
        closeBtnRef.current.click();
        handleAutoLogout();
        navigate('/login');
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
    children: PropTypes.object,
};

export default SessionManager;
