import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

import { StaffContext } from '~/contexts/StaffContext.jsx';
import { staffActions } from '~/utils/index.js';

const SessionManager = ({ children }) => {
    const { staff, setStaff, token, setToken, isAuthenticated, setIsAuthenticated } = useContext(StaffContext);
    const navigate = useNavigate();

    useEffect(() => {
        let timer = null;
        if (!isAuthenticated) {
            navigate('/login');
        } else {
            navigate(window.location.pathname);
            timer = setTimeout(() => {
                handleAutoLogout();
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
        setStaff({});
        setToken('');
        setIsAuthenticated(false);
        Swal.fire({
            icon: 'info',
            title: 'Phiên đăng nhập của bạn đã hết. Vui lòng đăng nhập lại.',
            confirmButtonText: 'Đăng nhập',
            cancelButttonText: 'Hủy',
            allowOutsideClick: false,
        }).then((result) => {
            if (result.isConfirmed) {
                navigate('/login');
            }
        });
    };
    return children;
};

export default SessionManager;
