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

                    const Element = (
                        <Layout>
                            <Page />
                        </Layout>
                    );

                    return route.protected ? (
                        <Route key={index} path={path} element={<ProtectedRoute>{Element}</ProtectedRoute>} />
                    ) : (
                        <Route key={index} path={path} element={Element} />
                    );
                })}
            </Routes>
        </Router>
    );
};

export default App;
