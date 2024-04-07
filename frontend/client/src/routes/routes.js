// layouts
import MainLayout from '~/layouts/MainLayout.jsx';
import NoColumnLayout from '~/layouts/NoColumnLayout.jsx';
import UserLayout from '~/layouts/UserLayout.jsx';
import EmptyLayout from '~/layouts/EmptyLayout.jsx';

// pages
import Home from '~/pages/Home/Home.jsx';
import ProductDetail from '~/pages/ProductDetail/ProductDetail.jsx';
import UserProfile from '~/pages/UserProfile/UserProfile.jsx';
import UserAddress from '~/pages/UserAddress/UserAddress.jsx';
import UserAddressAdd from '~/pages/UserAddressAdd/UserAddressAdd.jsx';
import UserPassword from '~/pages/UserPassword/UserPassword.jsx';
import UserOrder from '~/pages/UserOrder/UserOrder.jsx';
import UserCart from '~/pages/UserCart/UserCart.jsx';
import UserCheckout from '~/pages/UserCheckout/UserCheckout.jsx';
import OrderDetail from '~/pages/OrderDetail/OrderDetail.jsx';
import Login from '~/pages/Login/Login.jsx';
import Register from '~/pages/Register/Register.jsx';

import routesName from '~/config/routes.js';

const routes = [
    {
        path: routesName.home,
        page: Home,
        layout: MainLayout,
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
        path: routesName.productDetail,
        page: ProductDetail,
        layout: NoColumnLayout,
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
