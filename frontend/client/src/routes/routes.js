// layouts
import UserLayout from '~/layouts/UserLayout.jsx';
import MainLayout from '~/layouts/MainLayout.jsx';

// pages
import {
    Home,
    Login,
    Register,
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
    NotFound,
    ForgotPassword,
    VerifyCode,
    ResetPassword,
    SendVerifyCode,
} from '~/pages/index.js';

import routesName from '~/config/routes.js';

const routes = [
    {
        path: routesName.origin,
        page: Home,
    },
    {
        path: routesName.home,
        page: Home,
    },
    {
        path: routesName.login,
        page: Login,
        layout: MainLayout,
    },
    {
        path: routesName.forgotPassword,
        page: ForgotPassword,
        layout: MainLayout,
    },
    {
        path: routesName.sendVerifyCode,
        page: SendVerifyCode,
        layout: MainLayout,
    },
    {
        path: routesName.verifyCode,
        page: VerifyCode,
        layout: MainLayout,
    },
    {
        path: routesName.resetPassword,
        page: ResetPassword,
        layout: MainLayout,
    },
    {
        path: routesName.register,
        page: Register,
        layout: MainLayout,
    },
    {
        path: routesName.products,
        page: Products,
        layout: MainLayout,
    },
    {
        path: routesName.productDetail,
        page: ProductDetail,
        layout: MainLayout,
    },
    {
        path: routesName.userProfile,
        page: UserProfile,
        layout: UserLayout,
        protected: true,
    },
    {
        path: routesName.user,
        page: UserProfile,
        layout: UserLayout,
        protected: true,
    },
    {
        path: routesName.userAddress,
        page: UserAddress,
        layout: UserLayout,
        protected: true,
    },
    {
        path: routesName.userAddressAdd,
        page: UserAddressAdd,
        layout: UserLayout,
        protected: true,
    },
    {
        path: routesName.userAddressEdit,
        page: UserAddressAdd,
        layout: UserLayout,
        protected: true,
    },
    {
        path: routesName.userPassword,
        page: UserPassword,
        layout: UserLayout,
        protected: true,
    },
    {
        path: routesName.userOrders,
        page: UserOrder,
        layout: UserLayout,
        protected: true,
    },
    {
        path: routesName.userCart,
        page: UserCart,
        layout: UserLayout,
        protected: true,
    },
    {
        path: routesName.userCheckout,
        page: UserCheckout,
        layout: UserLayout,
        protected: true,
    },
    {
        path: routesName.orderDetail,
        page: OrderDetail,
        layout: UserLayout,
        protected: true,
    },
    {
        path: routesName.notFound,
        page: NotFound,
        layout: MainLayout,
    },
];

export default routes;
