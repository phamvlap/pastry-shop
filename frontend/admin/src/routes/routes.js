// layouts
import MainLayout from '~/layouts/MainLayout/MainLayout.jsx';
import LoginLayout from '~/layouts/LoginLayout/LoginLayout.jsx';

// pages
import Home from '~/pages/Home/Home.jsx';
import Login from '~/pages/Login/Login.jsx';
import Product from '~/pages/Product/Product.jsx';
import ProductDetail from '~/pages/ProductDetail/ProductDetail.jsx';
import ProductEdit from '~/pages/ProductEdit/ProductEdit.jsx';
import ProductAdd from '~/pages/ProductAdd/ProductAdd.jsx';
import Category from '~/pages/Category/Category.jsx';
import Discount from '~/pages/Discount/Discount.jsx';
import Supplier from '~/pages/Supplier/Supplier.jsx';
import Order from '~/pages/Order/Order.jsx';
import Customer from '~/pages/Customer/Customer.jsx';
import Statistics from '~/pages/Statistics/Statistics';
import Setting from '~/pages/Setting/Setting.jsx';
import Staff from '~/pages/Staff/Staff.jsx';

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
        layout: LoginLayout,
    },
    {
        path: routesName.products,
        page: Product,
        layout: MainLayout,
    },
    {
        path: routesName.productDetail,
        page: ProductDetail,
        layout: MainLayout,
    },
    {
        path: routesName.productEdit,
        page: ProductEdit,
        layout: MainLayout,
    },
    {
        path: routesName.productAdd,
        page: ProductAdd,
        layout: MainLayout,
    },
    {
        path: routesName.categories,
        page: Category,
        layout: MainLayout,
    },
    {
        path: routesName.discounts,
        page: Discount,
        layout: MainLayout,
    },
    {
        path: routesName.suppliers,
        page: Supplier,
        layout: MainLayout,
    },
    {
        path: routesName.orders,
        page: Order,
        layout: MainLayout,
    },
    {
        path: routesName.customers,
        page: Customer,
        layout: MainLayout,
    },
    {
        path: routesName.staffs,
        page: Staff,
        layout: MainLayout,
    },
    {
        path: routesName.statistics,
        page: Statistics,
        layout: MainLayout,
    },
    {
        path: routesName.settings,
        page: Setting,
        layout: MainLayout,
    },
];

export default routes;
