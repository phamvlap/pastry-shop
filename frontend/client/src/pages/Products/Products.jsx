import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import classNames from 'classnames/bind';

import { SortBar, CardItem, Pagination } from '~/components/index.js';
import { ProductService } from '~/services/index.js';
import Sidebar from '~/layouts/partials/Sidebar.jsx';

import styles from './Products.module.scss';

const cx = classNames.bind(styles);

const filterOptions = [
    'product_name',
    'category_id',
    'supplier_id',
    'discount_id',
    'createdAtOrder',
    'priceOrder',
    'status',
    'limit',
    'offset',
];

const Products = () => {
    const [totalRecords, setTotalRecords] = useState(0);
    const [productList, setProductList] = useState([]);
    const [totalPages, setTotalPages] = useState(null);
    const [recordOffset, setRecordOffset] = useState(null);
    const [recordsPerPage, setRecordsPerPage] = useState(Number(import.meta.env.VITE_DEFAULT_RECORDS_PER_PAGE));
    const [currentPage, setCurrentPage] = useState(1);
    const [filter, setFilter] = useState({});

    const productService = new ProductService();
    const [searchParams, setSearchParams] = useSearchParams();

    const fetchProductData = async (options) => {
        let filter = {};
        let response = null;
        for (const key of filterOptions) {
            if (options[key]) {
                filter[key] = options[key];
            }
        }
        if (filter.limit && !filter.offset) {
            filter.offset = 0;
        }
        response = await productService.getCount(filter);
        if (response.status === 'success') {
            setTotalRecords(response.data);
            setTotalPages(
                Math.ceil(response.data / (filter.limit || Number(import.meta.env.VITE_DEFAULT_RECORDS_PER_PAGE))),
            );
        }
        response = await productService.getAll(filter);
        let data = [];
        if (response.status === 'success') {
            for (const row of response.data) {
                data.push({
                    product_id: row.product_id,
                    product_name: row.product_name,
                    product_images: row.images.map((image) => {
                        return {
                            image_id: image.image_id,
                            image_url: `${import.meta.env.VITE_UPLOADED_DIR}${image.image_url.split('/uploads/')[1]}`,
                        };
                    }),
                    product_stock_quantity: row.product_stock_quantity,
                    product_sold_quantity: row.product_sold_quantity,
                    product_price: row.price.price_value,
                    product_category: row.category,
                    product_discount: row.discount,
                    product_ratings: row.ratings,
                });
            }
            setProductList(data);
        }
    };

    useEffect(() => {
        const getTotalProducts = async () => {
            const response = await productService.getCount({});
            setTotalRecords(response.data);
            setTotalPages(Math.ceil(response.data / recordsPerPage));
            setCurrentPage(1);
        };
        getTotalProducts();
    }, []);

    useEffect(() => {
        fetchProductData(filter);
        setTotalPages(Math.ceil(totalRecords / recordsPerPage));
        setRecordOffset((currentPage - 1) * recordsPerPage);
        setSearchParams({
            ...filter,
        });
    }, [filter, currentPage, recordsPerPage, recordOffset]);

    return (
        <div>
            <div className="container">
                {/* <div className={cx('breadcrumb-wrapper')}>
                    <ul className={cx('breadcrumb')}>
                        <li className={cx('breadcrumb-item')}>Trang chủ</li>
                        <span className={cx('breadcrumb-seperate')}>/</span>
                        <li className={cx('breadcrumb-item')}>Danh muc</li>
                        <span className={cx('breadcrumb-seperate')}>/</span>
                        <li className={cx('breadcrumb-item')}>Do uong</li>
                    </ul>
                </div> */}
            </div>
            <div className="container">
                <div className={cx('content-wrapper')}>
                    <div className="row">
                        <div className="col-md-3">
                            <Sidebar filter={filter} setFilter={setFilter} />
                        </div>
                        <div className="col-md-9">
                            <div className={cx('container')}>
                                <SortBar filter={filter} setFilter={setFilter} />
                                <div className={cx('products-list')}>
                                    <h2 className={cx('list-title')}>Dành cho bạn</h2>
                                    <div className={cx('list-container')}>
                                        <div className="row">
                                            {productList.map((product) => {
                                                return (
                                                    <div className="col-3" key={product.product_id}>
                                                        <CardItem product={product} />
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                                <div className={cx('products-pagination')}>
                                    <Pagination
                                        totalPages={totalPages}
                                        currentPage={currentPage}
                                        setCurrentPage={setCurrentPage}
                                        recordsPerPage={recordsPerPage}
                                        setRecordsPerPage={setRecordsPerPage}
                                        recordOffset={recordOffset}
                                        setRecordsOffset={setRecordOffset}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Products;
