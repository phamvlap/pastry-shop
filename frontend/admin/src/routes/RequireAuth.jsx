import { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { StaffContext } from '~/contexts/StaffContext.jsx';
import SessionManager from '~/session/SessionManager.jsx';

const RequireAuth = ({ children }) => {
    const { isAuthenticated } = useContext(StaffContext);
    const location = useLocation();

    if (!isAuthenticated) {
        return (
            <Navigate
                to="/login"
                state={{
                    from: location,
                }}
                replace
            />
        );
    }
    return <SessionManager>{children}</SessionManager>;
};

RequireAuth.propTypes = {
    children: PropTypes.object,
};

export default RequireAuth;
