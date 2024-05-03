import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames/bind';
import Chart from 'chart.js/auto';
import { CategoryScale } from 'chart.js';

import { BarChart } from '~/components/index.js';
import appConfig from '~/config/index.js';
import StaffActions from '~/utils/staffActions.js';
import { CustomerService, StaffService, ProductService, OrderService, CategoryService } from '~/services/index.js';
import Helper from '~/utils/helper.js';
import routes from '~/config/routes.js';

import styles from './Home.module.scss';

const cx = classNames.bind(styles);
Chart.register(CategoryScale);

const configApi = {
    headers: {
        Authorization: `Bearer ${StaffActions.getToken()}`,
    },
};

// number of customer, staff, product, order, category, number of product(out of update)
const Home = () => {
    const [nbCustomer, setNbCustomer] = useState(0);
    const [nbStaff, setNbStaff] = useState(0);
    const [nbProduct, setNbProduct] = useState(0);
    const [nbOrder, setNbOrder] = useState(0);
    const [nbCategory, setNbCategory] = useState(0);
    const [nbProductOutQuantity, setNbProductOutQuantity] = useState(0);
    const [data, setData] = useState(null);

    const fetchNumberCustomer = async () => {
        try {
            const customerService = new CustomerService(configApi);
            const response = await customerService.getAll();
            if (response.status === 'success') {
                setNbCustomer(response.data.length);
            }
        } catch (error) {
            console.error(error);
        }
    };
    const fetchNumberStaff = async () => {
        try {
            const staffService = new StaffService(configApi);
            const response = await staffService.getAll();
            if (response.status === 'success') {
                setNbStaff(response.data.length);
            }
        } catch (error) {
            console.error(error);
        }
    };
    const fetchNumberProduct = async () => {
        try {
            const productService = new ProductService(configApi);
            const response = await productService.getAll();
            if (response.status === 'success') {
                setNbProduct(response.data.length);
            }
        } catch (error) {
            console.error(error);
        }
    };
    const fetchNumberOrder = async () => {
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
                setNbOrder(response.data.count);
            }
        } catch (error) {
            console.error(error);
        }
    };
    const fetchNumberCategory = async () => {
        try {
            const categoryService = new CategoryService(configApi);
            const response = await categoryService.getAll();
            if (response.status === 'success') {
                setNbCategory(response.data.length);
            }
        } catch (error) {
            console.error(error);
        }
    };
    const fetchNumberProductOutQuantity = async () => {
        try {
            const productService = new ProductService(configApi);
            const response = await productService.getAll();
            if (response.status === 'success') {
                const nbProductOutQuantity = response.data.filter(
                    (product) => Number(product.product_stock_quantity) - Number(product.product_sold_quantity) < 2,
                ).length;
                setNbProductOutQuantity(nbProductOutQuantity);
            }
        } catch (error) {
            console.error(error);
        }
    };
    const createData = async () => {
        const date = new Date();
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const prevMonth = month - 1;
        let labels = [];
        let data = [];

        for (let i = prevMonth - 5; i <= prevMonth; ++i) {
            const currentMonth = i <= 0 ? i + 12 : i;
            const currentYear = i <= 0 ? year - 1 : year;
            let days = 0;
            let total = 0.0;
            days = Helper.getDaysInMonth(currentMonth, currentYear);
            try {
                const orderService = new OrderService(configApi);
                const response = await orderService.getAll({
                    status_id: null,
                    start_date: `${year}-${i}-01 00:00:00`,
                    end_date: `${year}-${i}-${days} 23:59:59`,
                    order_total: null,
                    limit: null,
                    offset: null,
                });
                if (response.status === 'success') {
                    response.data.orders.forEach((order) => {
                        total += Number(order.order_total);
                    });
                    labels.push(`Tháng ${currentMonth} (${currentYear})`);
                    data.push(total);
                }
            } catch (error) {
                console.error(error);
            }
        }
        setData({
            labels: labels,
            datasets: [
                {
                    data: data,
                    borderWidth: 1,
                    backgroundColor: '#427D9D',
                    barThickness: 68,
                },
            ],
        });
    };

    useEffect(() => {
        const fetchData = async () => {
            await fetchNumberCustomer();
            await fetchNumberStaff();
            await fetchNumberProduct();
            await fetchNumberOrder();
            await fetchNumberCategory();
            await fetchNumberProductOutQuantity();
            await createData();
        };
        fetchData();
    }, []);

    return (
        <div className={cx('home-container')}>
            <h1 className="p-2 text-center">
                <span>Chào mừng bạn đến với </span>
                <span>{appConfig.app.name}</span>
            </h1>
            <div className="row p-3">
                <div className="col col-md-3 p-0">
                    <div className={cx('card-item')}>
                        <h3 className={cx('card-item__title')}>Tổng khách hàng</h3>
                        <div className={cx('card-item__body')}>
                            <div className={cx('card-item__left')}>
                                <span className={cx('card-item__body-value')}>{nbCustomer}</span>
                                <span className={cx('card-item__body-unit')}>khách hàng</span>
                            </div>
                            <div className={cx('card-item__right')}>
                                <Link to={routes.customers} className={cx('card-item__footer-link')}>
                                    Xem chi tiết
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className={cx('card-item')}>
                        <h3 className={cx('card-item__title')}>Tổng nhân viên</h3>
                        <div className={cx('card-item__body')}>
                            <div className={cx('card-item__left')}>
                                <span className={cx('card-item__body-value')}>{nbStaff}</span>
                                <span className={cx('card-item__body-unit')}>nhân viên</span>
                            </div>
                            <div className={cx('card-item__right')}>
                                <Link to={routes.staffs} className={cx('card-item__footer-link')}>
                                    Xem chi tiết
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className={cx('card-item')}>
                        <h3 className={cx('card-item__title')}>Tổng sản phẩm</h3>
                        <div className={cx('card-item__body')}>
                            <div className={cx('card-item__left')}>
                                <span className={cx('card-item__body-value')}>{nbProduct}</span>
                                <span className={cx('card-item__body-unit')}>sản phẩm</span>
                            </div>
                            <div className={cx('card-item__right')}>
                                <Link to={routes.products} className={cx('card-item__footer-link')}>
                                    Xem chi tiết
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className={cx('card-item')}>
                        <h3 className={cx('card-item__title')}>Tổng đơn hàng</h3>
                        <div className={cx('card-item__body')}>
                            <div className={cx('card-item__left')}>
                                <span className={cx('card-item__body-value')}>{nbOrder}</span>
                                <span className={cx('card-item__body-unit')}>đơn hàng</span>
                            </div>
                            <div className={cx('card-item__right')}>
                                <Link to={routes.orders} className={cx('card-item__footer-link')}>
                                    Xem chi tiết
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className={cx('card-item')}>
                        <h3 className={cx('card-item__title')}>Tổng danh mục</h3>
                        <div className={cx('card-item__body')}>
                            <div className={cx('card-item__left')}>
                                <span className={cx('card-item__body-value')}>{nbCategory}</span>
                                <span className={cx('card-item__body-unit')}>danh mục</span>
                            </div>
                            <div className={cx('card-item__right')}>
                                <Link to={routes.categories} className={cx('card-item__footer-link')}>
                                    Xem chi tiết
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className={cx('card-item')}>
                        <h3 className={cx('card-item__title')}>Sắp hết hàng</h3>
                        <div className={cx('card-item__body')}>
                            <div className={cx('card-item__left')}>
                                <span className={cx('card-item__body-value')}>{nbProductOutQuantity}</span>
                                <span className={cx('card-item__body-unit')}>sản phẩm</span>
                            </div>
                            <div className={cx('card-item__right')}>
                                <Link to={routes.products} className={cx('card-item__footer-link')}>
                                    Xem chi tiết
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col col-md-9 p-0">
                    <div className={cx('barchart-section')}>
                        <h3 className={cx('barchart-section__label')}>{`Thống kê doanh thu 6 tháng gần nhất`}</h3>
                        <div className={cx('barchart-section__body')}>
                            {data && (
                                <BarChart
                                    title={`Thống kê doanh thu 6 tháng gần nhất (${
                                        new Date().getMonth() - 5 <= 0
                                            ? new Date().getMonth() + 7
                                            : new Date().getMonth() - 5
                                    }/${
                                        new Date().getMonth() - 5 <= 0
                                            ? new Date().getFullYear() - 1
                                            : new Date().getFullYear()
                                    } - ${new Date().getMonth()}/${new Date().getFullYear()})`}
                                    data={data}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
