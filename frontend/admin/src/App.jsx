import { Fragment } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import SessionManager from '~/SessionManager.jsx';

import routes from '~/routes/routes.js';
import { useContext, useEffect } from 'react';

import { StaffContext } from '~/contexts/StaffContext.jsx';

const App = () => {
    const { staff, setStaff, token, setToken, isAuthenticated, setIsAuthenticated } = useContext(StaffContext);

    return (
        <Router>
            <Routes>
                {routes.map((route, index) => {
                    const { path, layout, page } = route;
                    const Layout = layout || Fragment;
                    const Page = page;
                    return (
                        <Route
                            key={index}
                            path={path}
                            element={
                                isAuthenticated ? (
                                    <SessionManager>
                                        <Layout>
                                            <Page />
                                        </Layout>
                                    </SessionManager>
                                ) : (
                                    <Layout>
                                        <Page />
                                    </Layout>
                                )
                            }
                        />
                    );
                })}
            </Routes>
        </Router>
    );
};

export default App;
