import PropTypes from 'prop-types';
import { createContext, useState, useEffect } from 'react';

const UserContext = createContext();

const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState('');
    const [isLogged, setIsLogged] = useState(false);

    useEffect(() => {
        const data = JSON.parse(localStorage.getItem(import.meta.env.VITE_LOCAL_USER_KEY));
        if (data) {
            setUser(data.user);
            setToken(data.token);
            setIsLogged(true);
        }
    }, []);

    return (
        <UserContext.Provider value={{ user, setUser, token, setToken, isLogged, setIsLogged }}>
            {children}
        </UserContext.Provider>
    );
};

UserProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export { UserContext };
export default UserProvider;
