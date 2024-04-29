import { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';

import { UserContext } from '~/contexts/UserContext.jsx';
import routes from '~/config/routes.js';
import SessionManager from '~/session/SessionManager.jsx';

const ProtectedRoute = ({ children }) => {
    const { isLogged } = useContext(UserContext);
    const location = useLocation();

    return isLogged ? (
        <SessionManager>{children}</SessionManager>
    ) : (
        <Navigate to={routes.login} state={{ from: location }} replace />
    );
};

ProtectedRoute.propTypes = {
    children: PropTypes.node.isRequired,
};

export default ProtectedRoute;
