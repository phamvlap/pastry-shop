import { Fragment } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import RequireAuth from '~/routes/RequireAuth.jsx';

import routes from '~/routes/routes.js';

const App = () => {
    return (
        <Router>
            <Routes>
                {routes.map((route, index) => {
                    const { path, layout, page } = route;
                    const Layout = layout || Fragment;
                    const Page = page;

                    const Element = (
                        <Layout>
                            <Page />
                        </Layout>
                    );
                    return route.requireAuth ? (
                        <Route key={index} path={path} element={<RequireAuth>{Element}</RequireAuth>} />
                    ) : (
                        <Route key={index} path={path} element={Element} />
                    );
                })}
            </Routes>
        </Router>
    );
};

export default App;
