import { useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';

import styles from '~/layouts/MainLayout/MainLayout.module.scss';
import Header from '~/layouts/partials/Header.jsx';
import SideNav from '~/layouts/partials/SideNav.jsx';
import Footer from '~/layouts/partials/Footer.jsx';
import ColumnLayout from '~/layouts/ColumnLayout/ColumnLayout.jsx';
import { Wrapper } from '~/components/index.js';

const cx = classNames.bind(styles);

const MainLayout = ({ children }) => {
    const [activeSideNav, setActiveSideNav] = useState(() => {
        return `/${window.location.pathname.split('/')[1]}`;
    });

    return (
        <div className={cx('wrapper')}>
            <ColumnLayout
                sides={[
                    {
                        className: cx('sidenav'),
                        columns: 2,
                        element: <SideNav activeSideNav={activeSideNav} setActiveSideNav={setActiveSideNav} />,
                    },
                    {
                        className: cx('offset-md-2', 'content'),
                        columns: 10,
                        element: (
                            <>
                                <Header />
                                <div className={cx('content-body')}>
                                    <Wrapper style={{ color: 'blue' }}>{children}</Wrapper>
                                </div>
                                <Footer />
                            </>
                        ),
                    },
                ]}
            />
        </div>
    );
};

MainLayout.propTypes = {
    children: PropTypes.object.isRequired,
};

export default MainLayout;
