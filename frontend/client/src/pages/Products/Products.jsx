import { useEffect, useState } from 'react';
import { useSearchParams, useLocation } from 'react-router-dom';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';

import { SortBar, CardItem, Pagination } from '~/components/index.js';
import { ProductService } from '~/services/index.js';
import Sidebar from '~/layouts/partials/Sidebar.jsx';
import Helper from '~/utils/helper.js';

import styles from './Products.module.scss';

const cx = classNames.bind(styles);

const filterOptions = [
    'product_name',
    'search_name',
    'product_slug',
    'category_id',
    'supplier_id',
    'discount_id',
    'createdAtOrder',
    'priceOrder',
    'status',
    'limit',
    'offset',
];

const Products = ({ setToasts }) => {
    const [totalRecords, setTotalRecords] = useState(0);
    const [productList, setProductList] = useState(null);
    const [totalPages, setTotalPages] = useState(null);
    const [recordOffset, setRecordOffset] = useState(null);
    const [recordsPerPage, setRecordsPerPage] = useState(Number(import.meta.env.VITE_DEFAULT_RECORDS_PER_PAGE));
    const [currentPage, setCurrentPage] = useState(1);
    const [filter, setFilter] = useState({});

    const productService = new ProductService();
    const [searchParams, setSearchParams] = useSearchParams();
    const location = useLocation();

    const fetchProductData = async (options) => {
        try {
            let localFilter = {};
            let response = null;
            for (const key of filterOptions) {
                if (options[key] && options[key] !== '' && options[key] !== undefined) {
                    localFilter[key] = options[key];
                }
            }
            localFilter.limit = recordsPerPage ? recordsPerPage : Number(import.meta.env.VITE_DEFAULT_RECORDS_PER_PAGE);
            localFilter.offset = recordOffset ? recordOffset : 0;
            if (localFilter.search_name) {
                localFilter.product_slug = localFilter.search_name;
            }
            response = await productService.getCount(localFilter);
            if (response.status === 'success') {
                setTotalRecords(response.data);
                setTotalPages(
                    Math.ceil(
                        response.data / (localFilter.limit || Number(import.meta.env.VITE_DEFAULT_RECORDS_PER_PAGE)),
                    ),
                );
            }
            response = await productService.getAll(localFilter);
            let data = [];
            if (response.status === 'success') {
                for (const row of response.data) {
                    data.push({
                        product_id: row.product_id,
                        product_name: row.product_name,
                        product_images: row.images.map((image) => {
                            return {
                                image_id: image.image_id,
                                image_url: Helper.formatImageUrl(image.image_url),
                            };
                        }),
                        product_stock_quantity: row.product_stock_quantity,
                        product_sold_quantity: row.product_sold_quantity,
                        product_price: row.price ? row.price.price_value : '',
                        product_category: row.category,
                        product_discount: row.discount,
                        product_ratings: row.ratings,
                    });
                }
                setProductList(data);
            }
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        const getTotalProducts = async (filter) => {
            const response = await productService.getCount(filter);
            setTotalRecords(response.data);
            setTotalPages(Math.ceil(response.data / recordsPerPage));
            setCurrentPage(1);
        };
        getTotalProducts({});
    }, []);

    useEffect(() => {
        fetchProductData(filter);
        setTotalPages(Math.ceil(totalRecords / recordsPerPage));
        setRecordOffset((currentPage - 1) * recordsPerPage);
        setSearchParams({
            ...filter,
        });
    }, [filter, currentPage, recordsPerPage, recordOffset]);

    useEffect(() => {
        if (location.search.includes('search_name')) {
            setFilter({
                ...filter,
                search_name: searchParams.get('search_name'),
            });
        } else {
            setFilter((prevFilter) => {
                if (prevFilter.search_name) {
                    delete prevFilter.search_name;
                }
                return prevFilter;
            });
            const newFilter = {};
            Object.keys(filter).forEach((key) => {
                if (key !== 'search_name') {
                    newFilter[key] = filter[key];
                }
            });
            fetchProductData(newFilter);
        }
    }, [location.search]);

    return (
        <div>
            <div className="container">
                <div className={cx('content-wrapper')}>
                    <div className="row">
                        <div className="col-md-3">
                            <Sidebar filter={filter} setFilter={setFilter} />
                        </div>
                        <div className="col-md-9">
                            <div className={cx('container')}>
                                {filter.search_name && (
                                    <div className={cx('p-2 mb-2', 'search-result')}>
                                        Có {totalRecords} sản phẩm được tìm thấy phù hợp với từ khóa &ldquo;
                                        {filter.search_name}&rdquo;
                                    </div>
                                )}
                                <SortBar filter={filter} setFilter={setFilter} />
                                <div className={cx('products-list')}>
                                    <h2 className={cx('list-title')}>Dành cho bạn</h2>
                                    <div className={cx('list-container')}>
                                        <div className="row">
                                            {productList &&
                                                productList.map((product) => {
                                                    return (
                                                        <div className="col-3" key={product.product_id}>
                                                            <CardItem product={product} setToasts={setToasts} />
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

Products.propTypes = {
    setToasts: PropTypes.func,
};

export default Products;
