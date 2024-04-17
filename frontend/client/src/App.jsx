import { Fragment } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

// routes
import routes from '~/routes/routes.js';
import ProtectedRoute from '~/routes/ProtectedRoute.jsx';

const App = () => {
    return (
        <Router>
            <Routes>
                {routes.map((route, index) => {
                    const { path, page, layout } = route;
                    const Layout = layout || Fragment;
                    const Page = page;

                    if (route.protected) {
                        return (
                            <Route key={index} element={<ProtectedRoute />}>
                                <Route
                                    path={path}
                                    element={
                                        <Layout>
                                            <Page />
                                        </Layout>
                                    }
                                />
                            </Route>
                        );
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
                })}
            </Routes>
        </Router>
    );
};

export default App;
