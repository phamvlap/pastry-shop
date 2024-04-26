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
        requireAuth: true,
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
        requireAuth: true,
    },
    {
        path: routesName.productDetail,
        page: ProductDetail,
        layout: MainLayout,
        requireAuth: true,
    },
    {
        path: routesName.productAdd,
        page: ProductAdd,
        layout: MainLayout,
        requireAuth: true,
    },
    {
        path: routesName.productEdit,
        page: ProductAdd,
        layout: MainLayout,
        requireAuth: true,
    },
    {
        path: routesName.categories,
        page: Category,
        layout: MainLayout,
        requireAuth: true,
    },
    {
        path: routesName.discounts,
        page: Discount,
        layout: MainLayout,
        requireAuth: true,
    },
    {
        path: routesName.suppliers,
        page: Supplier,
        layout: MainLayout,
        requireAuth: true,
    },
    {
        path: routesName.orders,
        page: Order,
        layout: MainLayout,
        requireAuth: true,
    },
    {
        path: routesName.orderDetail,
        page: OrderDetail,
        layout: MainLayout,
        requireAuth: true,
    },
    {
        path: routesName.customers,
        page: Customer,
        layout: MainLayout,
        requireAuth: true,
    },
    {
        path: routesName.staffs,
        page: Staff,
        layout: MainLayout,
        requireAuth: true,
    },
    {
        path: routesName.statistics,
        page: Statistics,
        layout: MainLayout,
        requireAuth: true,
    },
    {
        path: routesName.settings,
        page: Setting,
        layout: MainLayout,
        requireAuth: true,
    },
];

export default routes;
