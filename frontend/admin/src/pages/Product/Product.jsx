import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import classNames from 'classnames/bind';

import { ProductService } from '~/services/index.js';

import { Pagination, Table } from '~/components/index.js';
import SearchBar from '~/pages/Product/partials/SearchBar.jsx';
import ControlPanel from '~/pages/Product/partials/ControlPanel.jsx';

import styles from '~/pages/Product/Product.module.scss';

const cx = classNames.bind(styles);

const header = {
    hasCheckbox: true,
    product_id: {
        value: 'Mã sản phẩm',
        isModified: false,
    },
    product_name: {
        value: 'Tên sản phẩm',
        isModified: false,
    },
    product_image: {
        value: 'Hình ảnh',
        isModified: false,
    },
    product_stock_quantity: {
        value: 'Số lượng trong kho',
        isModified: false,
    },
    product_status: {
        value: 'Trạng thái',
        isModified: false,
        views: ['Còn hàng', 'Hết hàng'],
    },
    category_name: {
        value: 'Danh mục',
        isModified: false,
    },
};
const actions = {
    detail: {
        value: 'Chi tiết',
        isDirected: true,
        isModifiedInRow: false,
    },
    edit: {
        value: 'Sửa',
        isDirected: true,
        isModifiedInRow: false,
    },
};
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

const Product = () => {
    const [totalRecords, setTotalRecords] = useState(0);
    const [productList, setProductList] = useState([]);
    const [totalPages, setTotalPages] = useState(null);
    const [recordOffset, setRecordOffset] = useState(null);
    const [recordsPerPage, setRecordsPerPage] = useState(Number(import.meta.env.VITE_DEFAULT_RECORDS_PER_PAGE));
    const [currentPage, setCurrentPage] = useState(1);
    const [currentFilter, setCurrentFilter] = useState({
        status: null,
        category_id: null,
    });
    const [activeRow, setActiveRow] = useState(null);

    const productService = new ProductService();
    const [searchParams, setSearchParams] = useSearchParams();

    const fetchProduct = async (options) => {
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
        setTotalRecords(response.data);
        setTotalPages(
            Math.ceil(response.data / (filter.limit || Number(import.meta.env.VITE_DEFAULT_RECORDS_PER_PAGE))),
        );

        response = await productService.getAll(filter);
        let data = [];
        for (const row of response.data) {
            data.push({
                product_id: row.product_id,
                product_name: row.product_name,
                product_image:
                    row.images.length > 0
                        ? `${import.meta.env.VITE_UPLOADED_DIR}${row.images[0].image_url.split('/uploads/')[1]}`
                        : '',
                product_stock_quantity: row.product_stock_quantity,
                product_status: row.product_stock_quantity > row.product_sold_quantity,
                category_name: row.category ? row.category.category_name : '',
            });
        }
        setProductList(data);
    };

    useEffect(() => {
        const getTotalProducts = async () => {
            const response = await productService.getCount({
                status: currentFilter.status,
                category_id: currentFilter.category_id,
            });
            setTotalRecords(response.data);
            setTotalPages(Math.ceil(response.data / recordsPerPage));
            setCurrentPage(1);
        };
        getTotalProducts();
    }, [currentFilter.status, currentFilter.category]);

    useEffect(() => {
        fetchProduct({
            status: currentFilter.status,
            category_id: currentFilter.category_id,
            limit: recordsPerPage,
            offset: recordOffset,
        });
        setTotalPages(Math.ceil(totalRecords / recordsPerPage));
        setRecordOffset((currentPage - 1) * recordsPerPage);
        setSearchParams({
            status: currentFilter.status,
            category_id: currentFilter.category_id,
            page: currentPage,
            limit: recordsPerPage,
        });
    }, [currentPage, recordOffset, recordsPerPage, currentFilter.status, currentFilter.category_id]);

    return (
        <div className={cx('product-container')}>
            <h2 className={cx('product-title')}>Danh sách sản phẩm</h2>
            <ControlPanel />
            <SearchBar setRecordsPerPage={setRecordsPerPage} setCurrentFilter={setCurrentFilter} />
            <div className="mt-3">
                <Table
                    entityName="product"
                    header={header}
                    data={productList}
                    setData={setProductList}
                    actions={actions}
                    setActiveRow={setActiveRow}
                />
            </div>
            <div className="mt-3">
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
    );
};

export default Product;
