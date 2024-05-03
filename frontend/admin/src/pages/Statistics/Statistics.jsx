import { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import Chart from 'chart.js/auto';
import { CategoryScale } from 'chart.js';

import { Button, BarChart } from '~/components/index.js';
import {
    CustomerService,
    StaffService,
    ProductService,
    OrderService,
    CategoryService,
    StatusService,
} from '~/services/index.js';
import StaffActions from '~/utils/staffActions.js';
import Helper from '~/utils/helper.js';

import styles from './Statistics.module.scss';

Chart.register(CategoryScale);
const cx = classNames.bind(styles);
const configApi = {
    headers: {
        Authorization: `Bearer ${StaffActions.getToken()}`,
    },
};
const overallTemplate = {
    nbCustomer: {
        title: 'Tổng khách hàng',
        unit: 'khách hàng.',
    },
    nbStaff: {
        title: 'Tổng nhân viên',
        unit: 'nhân viên.',
    },
    nbProduct: {
        title: 'Tổng sản phẩm',
        unit: 'sản phẩm.',
    },
    nbOrder: {
        title: 'Tổng đơn hàng',
        unit: 'đơn hàng.',
    },
    nbCategory: {
        title: 'Tổng danh mục',
        unit: 'danh mục.',
    },
};
const monthDataTemplate = {
    nbNewProduct: {
        title: 'Số lượng sản phẩm thêm mới',
        unit: 'sản phẩm.',
    },
    nbSoldProduct: {
        title: 'Số lượng sản phẩm bán ra',
        unit: 'sản phẩm.',
    },
    outStockProducts: {
        title: 'Số sản phẩm tồn kho',
        unit: 'sản phẩm.',
    },
    nbNewOrder: {
        title: 'Số lượng đơn hàng mới',
        unit: 'đơn hàng.',
    },
    totalRevenue: {
        title: 'Tổng doanh thu',
        unit: 'VNĐ.',
    },
    rateGrowRevenue: {
        title: 'Tỷ lệ tăng trưởng doanh thu',
        unit: '%',
    },
};

const Statistics = () => {
    const [overallData, setOrverallData] = useState(null);
    const [monthFilter, setMonthFilter] = useState({
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
    });
    const [monthFilterView, setMonthFilterView] = useState({
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
    });
    const [monthData, setMonthData] = useState(null);
    const [revenueFilter, setRevenueFilter] = useState(() => {
        const date = new Date();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        return {
            start: `${month - 5 <= 0 ? month - 5 + 12 : month - 5}/${month - 5 <= 0 ? year - 1 : year}`,
            end: `${month - 1}/${year}`,
        };
    });
    const [revenueFilterView, setRevenueFilterView] = useState(() => {
        const date = new Date();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        return {
            start: `${month - 5 <= 0 ? month - 5 + 12 : month - 5}/${month - 5 <= 0 ? year - 1 : year}`,
            end: `${month - 1}/${year}`,
        };
    });
    const [chartData, setChartData] = useState(null);
    const [errors, setErrors] = useState({
        monthFilter: '',
        revenueFilter: '',
    });
    const [orderData, setOrderData] = useState(null);

    const getOrderStatus = async () => {
        try {
            const statusService = new StatusService(configApi);
            const orderService = new OrderService(configApi);
            const response = await statusService.getAll();
            if (response.status === 'success') {
                let labels = [];
                let data = [];
                for (const status of response.data) {
                    labels.push(status.vn_status_name);
                    const responseOrder = await orderService.getAll({
                        status_id: status.status_id,
                        start_date: null,
                        end_date: null,
                        order_total: null,
                        limit: null,
                        offset: null,
                    });
                    if (responseOrder.status === 'success') {
                        data.push(responseOrder.data.count);
                    }
                }
                return {
                    labels: labels,
                    datasets: [
                        {
                            data: data,
                            borderWidth: 1,
                            backgroundColor: '#427D9D',
                            barThickness: 40,
                        },
                    ],
                };
            }
        } catch (error) {
            console.error(error);
        }
    };
    const getNumberCustomer = async () => {
        try {
            const customerService = new CustomerService(configApi);
            const response = await customerService.getAll();
            if (response.status === 'success') {
                return response.data.length;
            }
        } catch (error) {
            console.error(error);
        }
    };
    const getNumberStaff = async () => {
        try {
            const staffService = new StaffService(configApi);
            const response = await staffService.getAll();
            if (response.status === 'success') {
                return response.data.length;
            }
        } catch (error) {
            console.error(error);
        }
    };
    const getNumberProduct = async () => {
        try {
            const productService = new ProductService(configApi);
            const response = await productService.getAll();
            if (response.status === 'success') {
                return response.data.length;
            }
        } catch (error) {
            console.error(error);
        }
    };
    const getNumberOrder = async () => {
        try {
            const orderService = new OrderService(configApi);
            const response = await orderService.getAll({
                status_id: null,
                start_date: null,
                end_date: null,
                order_total: null,
                limit: null,
                offset: null,
            });
            if (response.status === 'success') {
                return response.data.count;
            }
        } catch (error) {
            console.error(error);
        }
    };
    const getNumberCategory = async () => {
        try {
            const categoryService = new CategoryService(configApi);
            const response = await categoryService.getAll();
            if (response.status === 'success') {
                return response.data.length;
            }
        } catch (error) {
            console.error(error);
        }
    };
    const getMonthData = async (monthFilter) => {
        try {
            const productService = new ProductService(configApi);
            const orderService = new OrderService(configApi);
            let nbNewProduct = 0;
            let nbSoldProduct = 0;
            let totalProducts = 0;
            let outStockProducts = 0;
            let nbNewOrder = 0;
            let totalRevenue = 0.0;
            let previousMonthRevenue = 0.0;
            let response = await productService.getAll();
            if (response.status === 'success') {
                response.data.forEach((product) => {
                    if (new Date(product.product_created_at).getMonth() + 1 === monthFilter.month) {
                        nbNewProduct += 1;
                    }
                });
                totalProducts = response.data.length;
            }
            response = await orderService.getAll({
                status_id: null,
                start_date: `${monthFilter.year}-${monthFilter.month}-01 00:00:00`,
                end_date: `${monthFilter.year}-${monthFilter.month}-31 23:59:59`,
                order_total: null,
                limit: null,
                offset: null,
            });
            if (response.status === 'success') {
                let soldProduct = [];
                response.data.orders.forEach((order) => {
                    nbSoldProduct += order.items.reduce((total, item) => total + item.product_quantity, 0);
                    totalRevenue += Number(order.order_total);
                    for (const item of order.items) {
                        let existedProduct = soldProduct.find((product) => product.product_id === item.product_id);
                        if (!existedProduct) {
                            soldProduct.push({
                                product_id: item.product_id,
                                product_quantity: item.product_quantity,
                            });
                        }
                    }
                });
                outStockProducts = totalProducts - soldProduct.length;
                nbNewOrder = response.data.orders.length;
            }
            response = await orderService.getAll({
                status_id: null,
                start_date: `${monthFilter.year}-${monthFilter.month - 1}-01 00:00:00`,
                end_date: `${monthFilter.year}-${monthFilter.month - 1}-31 23:59:59`,
                order_total: null,
                limit: null,
                offset: null,
            });
            if (response.status === 'success') {
                previousMonthRevenue = response.data.orders.reduce(
                    (total, order) => total + Number(order.order_total),
                    0,
                );
            }
            return {
                nbNewProduct,
                nbSoldProduct,
                outStockProducts,
                nbNewOrder,
                totalRevenue: Helper.formatMoney(totalRevenue),
                rateGrowRevenue:
                    previousMonthRevenue !== 0
                        ? ((totalRevenue - previousMonthRevenue) / previousMonthRevenue) * 100
                        : 100,
            };
        } catch (error) {
            console.error(error);
        }
    };
    const getChartData = async (filter) => {
        const startMonth = Number(filter.start.month);
        const startYear = Number(filter.start.year);
        const endMonth = Number(filter.end.month);
        const endYear = Number(filter.end.year);
        const orderService = new OrderService(configApi);
        setRevenueFilterView({
            start: `${startMonth}/${startYear}`,
            end: `${endMonth}/${endYear}`,
        });
        let months = [];
        let curMonth = startMonth;
        let curYear = startYear;
        while ((curMonth <= endMonth && curYear <= endYear) || curYear < endYear) {
            months.push({
                month: curMonth,
                year: curYear,
            });
            if (curMonth === 12) {
                curMonth = 1;
                curYear += 1;
            } else {
                curMonth += 1;
            }
        }
        const labels = months.map((item) => `${item.month}/${item.year}`);
        let revenues = [];
        for (const item of months) {
            const days = Helper.getDaysInMonth(item.month - 1, item.year);
            const response = await orderService.getAll({
                status_id: null,
                start_date: `${item.year}-${item.month}-01 00:00:00`,
                end_date: `${item.year}-${item.month}-${days} 23:59:59`,
                order_total: null,
                limit: null,
                offset: null,
            });
            if (response.status === 'success') {
                const totalRevenue = response.data.orders.reduce(
                    (total, order) => total + Number(order.order_total),
                    0,
                );
                revenues.push({
                    month: item.month,
                    year: item.year,
                    totalRevenue,
                });
            }
        }
        const data = {
            labels: labels,
            datasets: [
                {
                    data: revenues.map((item) => item.totalRevenue),
                    borderWidth: 1,
                    backgroundColor: '#427D9D',
                    barThickness: 68,
                },
            ],
        };
        return data;
    };
    const handleMonthChange = (event) => {
        setMonthFilter({
            ...monthFilter,
            [event.target.name]: event.target.value,
        });
    };
    const submitMonthFilter = async () => {
        if (monthFilter.month === '' || monthFilter.year === '') {
            setErrors({
                ...errors,
                monthFilter: 'Tháng và năm không được để trống',
            });
            return;
        }
        const month = Number(monthFilter.month);
        const year = Number(monthFilter.year);
        if (isNaN(month) || isNaN(year)) {
            setErrors({
                ...errors,
                monthFilter: 'Tháng và năm phải là số',
            });
            return;
        }
        if (month < 1 || month > 12) {
            setErrors({
                ...errors,
                monthFilter: 'Tháng không hợp lệ',
            });
            return;
        }
        if (year > new Date().getFullYear() || year < 2020) {
            setErrors({
                ...errors,
                monthFilter: 'Năm không hợp lệ',
            });
            return;
        }
        setErrors({
            ...errors,
            monthFilter: '',
        });
        const data = await getMonthData(monthFilter);
        setMonthData(data);
        setMonthFilterView({
            month: monthFilter.month,
            year: monthFilter.year,
        });
    };
    const handleRevenueFilterChange = (event) => {
        setRevenueFilter({
            ...revenueFilter,
            [event.target.name]: event.target.value,
        });
    };
    const submitRevenueFilter = async () => {
        if (revenueFilter.start === '' || revenueFilter.end === '') {
            setErrors({
                ...errors,
                revenueFilter: 'Thời gian không được để trống',
            });
            return;
        }
        let startMonth = '';
        let startYear = '';
        let endMonth = '';
        let endYear = '';

        if (revenueFilter.start.includes('/')) {
            startMonth = Number(revenueFilter.start.split('/')[0]);
            startYear = Number(revenueFilter.start.split('/')[1]);
        } else if (revenueFilter.start.includes('-')) {
            startMonth = Number(revenueFilter.start.split('-')[0]);
            startYear = Number(revenueFilter.start.split('-')[1]);
        }
        if (revenueFilter.end.includes('/')) {
            endMonth = Number(revenueFilter.end.split('/')[0]);
            endYear = Number(revenueFilter.end.split('/')[1]);
        } else if (revenueFilter.end.includes('-')) {
            endMonth = Number(revenueFilter.end.split('-')[0]);
            endYear = Number(revenueFilter.end.split('-')[1]);
        }

        if (isNaN(startMonth) || isNaN(startYear) || isNaN(endMonth) || isNaN(endYear)) {
            setErrors({
                ...errors,
                revenueFilter: 'Thời gian không hợp lệ',
            });
            return;
        }
        if (startMonth < 1 || startMonth > 12 || endMonth < 1 || endMonth > 12) {
            setErrors({
                ...errors,
                revenueFilter: 'Thời gian không hợp lệ',
            });
            return;
        }
        if (
            startYear > new Date().getFullYear() ||
            startYear < 2020 ||
            endYear > new Date().getFullYear() ||
            endYear < 2020
        ) {
            setErrors({
                ...errors,
                revenueFilter: 'Thời gian không hợp lệ',
            });
            return;
        }

        if (startYear > endYear || (startYear === endYear && startMonth > endMonth)) {
            setErrors({
                ...errors,
                revenueFilter: 'Tháng bắt đầu phải nhỏ hơn tháng kết thúc',
            });
            return;
        }
        setErrors({
            ...errors,
            revenueFilter: '',
        });
        const data = await getChartData({
            start: {
                month: startMonth,
                year: startYear,
            },
            end: {
                month: endMonth,
                year: endYear,
            },
        });
        setChartData(data);
    };

    useEffect(() => {
        const fetchData = async () => {
            const nbCustomer = await getNumberCustomer();
            const nbStaff = await getNumberStaff();
            const nbProduct = await getNumberProduct();
            const nbOrder = await getNumberOrder();
            const nbCategory = await getNumberCategory();
            setOrverallData({
                nbCustomer,
                nbStaff,
                nbProduct,
                nbOrder,
                nbCategory,
            });
            const monthData = await getMonthData(monthFilter);
            setMonthData(monthData);
            const revenueData = await getChartData({
                start: {
                    month: revenueFilter.start.split('/')[0],
                    year: revenueFilter.start.split('/')[1],
                },
                end: {
                    month: revenueFilter.end.split('/')[0],
                    year: revenueFilter.end.split('/')[1],
                },
            });
            setChartData(revenueData);
            const orderData = await getOrderStatus();
            setOrderData(orderData);
        };
        getOrderStatus();
        fetchData();
    }, []);

    return (
        <div className={cx('statistics-container')}>
            <h2 className={cx('statistics-title')}>Thống kê</h2>
            <div className="mt-3">
                <div className={cx('overall-container')}>
                    {overallData &&
                        Object.keys(overallTemplate).map((key) => {
                            return (
                                <div className={cx('card-item')} key={key}>
                                    <h3 className={cx('card-item__title')}>{overallTemplate[key].title}</h3>
                                    <div className={cx('card-item__body')}>
                                        <div className={cx('card-item__left')}>
                                            <span className={cx('card-item__body-value')}>{overallData[key]}</span>
                                            <span className={cx('card-item__body-unit')}>
                                                {overallTemplate[key].unit}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                </div>
                <div className="mt-3">
                    <div className="row">
                        <div className="col col-md-5">
                            <h2 className={cx('statistics-title')}>Thống kê theo tháng</h2>
                            <div className={cx('filter-bar')}>
                                <div className={cx('filter-bar__inputs')}>
                                    <div className="input-group flex-nowrap">
                                        <span
                                            className={cx('input-group-text', 'filter-bar__label')}
                                            id="addon-wrapping"
                                        >
                                            Tháng
                                        </span>
                                        <input
                                            type="text"
                                            className={cx('form-control', 'filter-bar__input')}
                                            name="month"
                                            value={monthFilter.month}
                                            onChange={(event) => handleMonthChange(event)}
                                        />
                                    </div>
                                    <div className="input-group flex-nowrap ms-3">
                                        <span
                                            className={cx('input-group-text', 'filter-bar__label')}
                                            id="addon-wrapping"
                                        >
                                            Năm
                                        </span>
                                        <input
                                            type="text"
                                            className={cx('form-control', 'filter-bar__input')}
                                            name="year"
                                            value={monthFilter.year}
                                            onChange={(event) => handleMonthChange(event)}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <Button
                                        primary
                                        onClick={() => submitMonthFilter()}
                                        className={cx('filter-bar__btn')}
                                    >
                                        Xem
                                    </Button>
                                </div>
                            </div>
                            <div className="error">{errors.monthFilter}</div>
                            <div className={cx('month-result')}>
                                <h2 className={cx('statistics-title')}>
                                    Dữ liệu tháng {monthFilterView.month}/{monthFilterView.year}
                                </h2>
                                {monthData &&
                                    Object.keys(monthDataTemplate).map((key, index) => {
                                        let title = monthDataTemplate[key].title;
                                        let value = monthData[key];
                                        let unit = monthDataTemplate[key].unit;
                                        if (key === 'rateGrowRevenue') {
                                            value = value.toFixed(2);
                                            value = Math.abs(value);
                                            const subTitle = monthData[key] < 0 ? ` giảm` : ` tăng`;
                                            title = `${title} ${subTitle}`;
                                            unit += ` so với tháng ${
                                                Number(monthFilterView.month) - 1 <= 0
                                                    ? Number(monthFilterView.month) - 1 + 12
                                                    : Number(monthFilterView.month) - 1
                                            }/${
                                                Number(monthFilterView.month) - 1 <= 0
                                                    ? Number(monthFilterView.year) - 1
                                                    : Number(monthFilterView.year)
                                            }.`;
                                        }
                                        return (
                                            <div key={index} className={cx('month-result__item')}>
                                                <span className={cx('month-result__title')}>{title}</span>
                                                <span className={cx('month-result__value')}>{value}</span>
                                                <span className={cx('month-result__unit')}>{unit}</span>
                                            </div>
                                        );
                                    })}
                            </div>
                            <div className={cx('month-result')}>
                                <h2 className={cx('statistics-title')}>Trạng thái đơn hàng</h2>
                                <div>
                                    {orderData && (
                                        <BarChart title={`Biểu đồ thể hiện trạng thái đơn hàng`} data={orderData} />
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="col col-md-7">
                            <h2 className={cx('statistics-title')}>Thống kê doanh thu</h2>
                            <div className={cx('filter-bar')}>
                                <div className={cx('filter-bar__inputs')}>
                                    <div className="input-group flex-nowrap">
                                        <span
                                            className={cx('input-group-text', 'filter-bar__label')}
                                            id="addon-wrapping"
                                        >
                                            Từ tháng
                                        </span>
                                        <input
                                            type="text"
                                            className={cx('form-control', 'filter-bar__input')}
                                            name="start"
                                            value={revenueFilter.start}
                                            onChange={(event) => handleRevenueFilterChange(event)}
                                            placeholder="mm/yyyy hoặc mm-yyyy"
                                        />
                                    </div>
                                    <div className="input-group flex-nowrap ms-3">
                                        <span
                                            className={cx('input-group-text', 'filter-bar__label')}
                                            id="addon-wrapping"
                                        >
                                            Đến tháng
                                        </span>
                                        <input
                                            type="text"
                                            className={cx('form-control', 'filter-bar__input')}
                                            name="end"
                                            value={revenueFilter.end}
                                            onChange={(event) => handleRevenueFilterChange(event)}
                                            placeholder="mm/yyyy hoặc mm-yyyy"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <Button
                                        primary
                                        onClick={() => submitRevenueFilter()}
                                        className={cx('filter-bar__btn')}
                                    >
                                        Xem
                                    </Button>
                                </div>
                            </div>
                            <div className="error">{errors.revenueFilter}</div>
                            <div>
                                {chartData && (
                                    <BarChart
                                        title={`Biểu đồ thể hiện doanh thu từ ${revenueFilterView.start} đến ${revenueFilterView.end}`}
                                        data={chartData}
                                        unit=" (VNĐ)"
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Statistics;
