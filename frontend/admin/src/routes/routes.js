// layouts
import MainLayout from '~/layouts/MainLayout.jsx';
import NotSidebarLayout from '~/layouts/NotSidebarLayout.jsx';

import {
    Home,
    Login,
    Product,
    ProductDetail,
    ProductAdd,
    Category,
    Discount,
    Supplier,
    Order,
    OrderDetail,
    Customer,
    Staff,
    Statistics,
    Setting,
} from '~/pages/index.js';

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
        layout: NotSidebarLayout,
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
        path: routesName.productAdd,
        page: ProductAdd,
        layout: MainLayout,
    },
    {
        path: routesName.productEdit,
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
        path: routesName.orderDetail,
        page: OrderDetail,
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
