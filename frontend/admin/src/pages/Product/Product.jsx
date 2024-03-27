import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import Content from '~/pages/Product/partials/Content.jsx';
import { Wrapper } from '~/components/index.js';
import ColumnLayout from '~/layouts/ColumnLayout/ColumnLayout.jsx';

import { ProductService } from '~/services/index.js';

const uploadProductsDir = import.meta.env.VITE_UPLOAD_PRODUCTS_DIR;

const Product = () => {
    const [totalProducts, setTotalProducts] = useState(0);
    const [productList, setProductList] = useState([]);
    const [totalPages, setTotalPages] = useState(null);
    const [recordOffset, setRecordOffset] = useState(null);
    const [recordsPerPage, setRecordsPerPage] = useState(Number(import.meta.env.VITE_DEFAULT_RECORDS_PER_PAGE));
    const [currentPage, setCurrentPage] = useState(1);
    const [currentFilter, setCurrentFilter] = useState({
        status: 'all',
        category: 'all',
    });

    const productService = new ProductService();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    const fetchProduct = async (status, categoryId, limit, offset) => {
        let response = null;

        response = await productService.getCountByFilter(status, categoryId);
        setTotalProducts(response.data);
        setTotalPages(Math.ceil(response.data / limit));

        response = await productService.getProductsByFilter(status, categoryId, limit, offset);
        let data = [];
        for (const row of response.data) {
            data.push({
                product_id: row.product_id,
                product_name: row.product_name,
                product_image: `${uploadProductsDir}/${row.product_images.split(';')[0]}`,
                product_stock_quantity: row.product_stock_quantity,
                product_status: row.product_stock_quantity > row.product_sold_quantity,
                category_name: row.category ? row.category.category_name : '',
            });
        }
        setProductList(data);
    };

    useEffect(() => {
        const getTotalProducts = async () => {
            const response = await productService.getCountByFilter(currentFilter.status, currentFilter.category);
            setTotalProducts(response.data);
            setTotalPages(Math.ceil(response.data / recordsPerPage));
            setCurrentPage(1);
        };
        getTotalProducts();
    }, [currentFilter.status, currentFilter.category]);

    useEffect(() => {
        fetchProduct(currentFilter.status, currentFilter.category, recordsPerPage, recordOffset);
        setTotalPages(Math.ceil(totalProducts / recordsPerPage));
        setRecordOffset((currentPage - 1) * recordsPerPage);
        setSearchParams({
            status: currentFilter.status,
            category: currentFilter.category,
            page: currentPage,
            limit: recordsPerPage,
        });
    }, [currentPage, recordOffset, recordsPerPage, currentFilter.status, currentFilter.category]);

    return (
        <Wrapper padding={8}>
            <ColumnLayout
                sides={[
                    {
                        columns: 12,
                        element: (
                            <Content
                                productList={productList}
                                setProductList={setProductList}
                                totalPages={totalPages}
                                currentPage={currentPage}
                                setCurrentPage={setCurrentPage}
                                recordsPerPage={recordsPerPage}
                                setRecordsPerPage={setRecordsPerPage}
                                recordOffset={recordOffset}
                                setRecordsOffset={setRecordOffset}
                                setCurrentFilter={setCurrentFilter}
                            />
                        ),
                    },
                ]}
            />
        </Wrapper>
    );
};

export default Product;
