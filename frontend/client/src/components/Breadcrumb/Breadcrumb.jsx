import { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import classNames from 'classnames/bind';

import productActions from '~/utils/productActions.js';
import styles from './Breadcrumb.module.scss';

const cx = classNames.bind(styles);

const Breadcrumb = () => {
    const [breadcrumbs, setBreadcrumbs] = useState([]);
    const location = useLocation();

    const fetchProduct = async (id) => {
        try {
            const response = await productActions.getById(id);
            if (response.status === 'success') {
                return response.data;
            }
        } catch (error) {
            console.log('Failed to fetch product', error);
        }
    };

    const retrieveUrls = (pathnames) => {
        let urls = [];
        pathnames.forEach((pathname) => {
            let url = pathnames.slice(0, pathnames.indexOf(pathname) + 1).join('/');
            if (url === '') {
                url = '/';
            }
            if (pathname === 'product') {
                url = url.replace('product', 'products');
            }
            if (pathname === 'order') {
                url = url.replace('order', 'orders');
            }
            urls.push(url);
        });
        return urls;
    };
    const retrieveNames = async (pathnames) => {
        let names = [];
        for (let i = 0; i < pathnames.length; ++i) {
            const pathname = pathnames[i];
            let name = '';
            if (pathname === '') {
                name = 'Trang chủ';
            } else if (pathname === 'products' || pathname === 'product') {
                name = 'Sản phẩm';
            } else if (pathname === 'user') {
                name = 'Tài khoản';
            } else if (pathname === 'profile') {
                name = 'Hồ sơ của tôi';
            } else if (pathname === 'address') {
                name = 'Địa chỉ của tôi';
            } else if (pathname === 'password') {
                name = 'Đổi mật khẩu';
            } else if (pathname === 'orders' || pathname === 'order') {
                name = 'Đơn hàng của tôi';
            } else if (pathname === 'cart') {
                name = 'Giỏ hàng của tôi';
            } else if (pathname === 'checkout') {
                name = 'Xác nhận đơn hàng';
            } else if (pathname === 'add' && pathnames[i - 1] === 'address') {
                name = 'Thêm địa chỉ';
            } else if (pathname === 'edit' && pathnames[i - 1] === 'address') {
                name = 'Chỉnh sửa địa chỉ';
            }
            if (
                Number.isInteger(parseInt(pathname)) &&
                (pathnames[i - 1] === 'products' || pathnames[i - 1] === 'product')
            ) {
                const product = await fetchProduct(parseInt(pathname));
                if (product) {
                    name = product.product_name;
                }
            }
            if (
                (Number.isInteger(parseInt(pathname)) && pathnames[i - 1] === 'order') ||
                pathnames[i - 1] === 'orders'
            ) {
                name = `Đơn hàng #${pathname}`;
            }
            names.push(name);
        }
        return names;
    };

    useEffect(() => {
        const pathnames = location.pathname.split('/');
        const retrieveBreadcrumbs = async () => {
            const urls = retrieveUrls(pathnames);
            const names = await retrieveNames(pathnames);
            const breadcrumbItems = pathnames.map((_, index) => {
                return {
                    url: urls[index],
                    name: names[index],
                };
            });
            setBreadcrumbs(breadcrumbItems);
        };
        retrieveBreadcrumbs();
    }, [location.pathname]);

    return (
        <div className="container">
            <div className={cx('breadcrumb-wrapper')}>
                <ul className={cx('breadcrumb')}>
                    {breadcrumbs.length > 0 &&
                        breadcrumbs.map((breadcrumb, index) => {
                            return (
                                <li key={index}>
                                    <Link
                                        to={breadcrumb.url}
                                        className={cx('breadcrumb-link', {
                                            'breadcrumb-link__active': index === breadcrumbs.length - 1,
                                        })}
                                    >
                                        {breadcrumb.name}
                                    </Link>
                                    {index < breadcrumbs.length - 1 && (
                                        <span className={cx('breadcrumb-seperate')}>/</span>
                                    )}
                                </li>
                            );
                        })}
                </ul>
            </div>
        </div>
    );
};

export default Breadcrumb;
