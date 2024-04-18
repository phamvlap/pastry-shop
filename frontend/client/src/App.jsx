import { Fragment, useContext } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

// routes
import routes from '~/routes/routes.js';
import SessionManager from './SessionManger.jsx';
import { UserContext } from '~/contexts/UserContext.jsx';

const App = () => {
    const { isLogged } = useContext(UserContext);

    return (
        <Router>
            <Routes>
                {routes.map((route, index) => {
                    const { path, page, layout } = route;
                    const Layout = layout || Fragment;
                    const Page = page;

                    if (isLogged) {
                        return (
                            <Route
                                key={index}
                                path={path}
                                element={
                                    <SessionManager>
                                        <Layout>
                                            <Page />
                                        </Layout>
                                    </SessionManager>
                                }
                            />
                        );
                    } else {
                        if (route.protected) {
                            return <Route key={index} path={path} element={<Navigate to="/login" />}></Route>;
                        } else {
                            return (
                                <Route
                                    key={index}
                                    path={path}
                                    element={
                                        <Layout>
                                            <Page />
                                        </Layout>
                                    }
                                />
                            );
                        }
                    }
                })}
            </Routes>
        </Router>
    );
};

export default App;
