import { Fragment } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

// routes
import routes from '~/routes/routes.js';

const App = () => {
    return (
        <Router>
            <Routes>
                {routes.map((route, index) => {
                    const { path, page, layout } = route;
                    const Layout = layout || Fragment;
                    const Page = page;
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
                })}
            </Routes>
        </Router>
    );
};

export default App;
