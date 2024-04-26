import { useState, useEffect, createContext } from 'react';
import PropTypes from 'prop-types';

import { staffActions } from '~/utils/index.js';

const StaffContext = createContext();

const StaffProvider = ({ children }) => {
    const [staff, setStaff] = useState(null);
    const [token, setToken] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const token = staffActions.getToken();
        if (token.length > 0) {
            const staff = staffActions.getStaff();
            setStaff(staff);
            setToken(token);
            setIsAuthenticated(true);
        }
    }, []);

    return (
        <StaffContext.Provider
            value={{
                staff,
                setStaff,
                token,
                setToken,
                isAuthenticated,
                setIsAuthenticated,
            }}
        >
            {children}
        </StaffContext.Provider>
    );
};

StaffProvider.propTypes = {
    children: PropTypes.object,
};

export { StaffContext };
export default StaffProvider;
