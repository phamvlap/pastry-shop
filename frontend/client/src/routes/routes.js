// layouts
import UserLayout from '~/layouts/UserLayout.jsx';
import EmptyLayout from '~/layouts/EmptyLayout.jsx';

// pages
import {
    Home,
    Products,
    ProductDetail,
    UserProfile,
    UserAddress,
    UserAddressAdd,
    UserPassword,
    UserOrder,
    UserCart,
    UserCheckout,
    OrderDetail,
    Login,
    Register,
} from '~/pages/index.js';

import routesName from '~/config/routes.js';

const routes = [
    {
        path: routesName.home,
        page: Home,
    },
    {
        path: routesName.login,
        page: Login,
        layout: EmptyLayout,
    },
    {
        path: routesName.register,
        page: Register,
        layout: EmptyLayout,
    },
    {
        path: routesName.products,
        page: Products,
        layout: EmptyLayout,
    },
    {
        path: routesName.productDetail,
        page: ProductDetail,
        layout: EmptyLayout,
    },
    {
        path: routesName.userProfile,
        page: UserProfile,
        layout: UserLayout,
    },
    {
        path: routesName.userAddress,
        page: UserAddress,
        layout: UserLayout,
    },
    {
        path: routesName.userAddressAdd,
        page: UserAddressAdd,
        layout: UserLayout,
    },
    {
        path: routesName.userPassword,
        page: UserPassword,
        layout: UserLayout,
    },
    {
        path: routesName.userOrder,
        page: UserOrder,
        layout: UserLayout,
    },
    {
        path: routesName.userCart,
        page: UserCart,
        layout: UserLayout,
    },
    {
        path: routesName.userCheckout,
        page: UserCheckout,
        layout: UserLayout,
    },
    {
        path: routesName.orderDetail,
        page: OrderDetail,
        layout: UserLayout,
    },
];

export default routes;
