import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

import { UserContext } from '~/contexts/UserContext.jsx';

const ProtectedRoute = () => {
    const { isLogged } = useContext(UserContext);

    return isLogged ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
