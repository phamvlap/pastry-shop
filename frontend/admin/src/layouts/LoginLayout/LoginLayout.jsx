import PropTypes from 'prop-types';
import classNames from 'classnames/bind';

import ColumnLayout from '~/layouts/ColumnLayout/ColumnLayout.jsx';
import Header from '~/layouts/partials/Header.jsx';
import Footer from '~/layouts/partials/Footer.jsx';
import { Wrapper } from '~/components/index.js';

import styles from '~/layouts/LoginLayout/LoginLayout.module.scss';

const cx = classNames.bind(styles);

const LoginLayout = ({ children }) => {
    return (
        <div className={cx('wrapper')}>
            <ColumnLayout
                sides={[
                    {
                        className: cx('content'),
                        columns: 12,
                        element: (
                            <>
                                <Header />
                                <div className={cx('content-body')}>
                                    <Wrapper colorLevel="white">{children}</Wrapper>
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

LoginLayout.propTypes = {
    children: PropTypes.object.isRequired,
};

export default LoginLayout;
