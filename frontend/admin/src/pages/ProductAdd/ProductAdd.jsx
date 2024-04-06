import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames/bind';
import { useParams } from 'react-router-dom';

import AddForm from '~/pages/ProductAdd/partials/AddForm.jsx';
import { Heading, Button } from '~/components/index.js';

import { staffActions, formatDate } from '~/utils/index.js';
import { CategoryService, DiscountService, SupplierService, ProductService } from '~/services/index.js';
import styles from '~/pages/ProductAdd/ProductAdd.module.scss';

const cx = classNames.bind(styles);

const config = {
    headers: {
        authorization: `Bearer ${staffActions.getToken()}`,
    },
};

const ProductAdd = () => {
    const [categories, setCategories] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [discounts, setDiscounts] = useState([]);
    const [product, setProduct] = useState({});

    const { productId } = useParams();

    const categoryService = new CategoryService();
    const discountService = new DiscountService();
    const supplierService = new SupplierService();
    const productService = new ProductService(config);

    useEffect(() => {
        categoryService.getAll().then((response) => {
            let itemList = [];
            for (const item of response.data) {
                itemList.push({
                    value: item.category_id,
                    name: item.category_name,
                });
            }
            setCategories(itemList);
        });
        discountService.getAll().then((response) => {
            let itemList = [];
            for (const item of response.data) {
                itemList.push({
                    value: item.discount_id,
                    name: item.discount_code,
                });
            }
            setDiscounts(itemList);
        });
        supplierService.getAll().then((response) => {
            let itemList = [];
            for (const item of response.data) {
                itemList.push({
                    value: item.supplier_id,
                    name: item.supplier_name,
                });
            }
            setSuppliers(itemList);
        });
        if (productId) {
            productService.getById(productId).then((response) => {
                const item = {
                    product_id: response.data.product_id,
                    product_name: response.data.product_name,
                    product_stock_quantity: response.data.product_stock_quantity,
                    product_price: response.data.price.price_value,
                    product_expire_date: formatDate.convertToStandardFormat(response.data.product_expire_date),
                    product_category: response.data.category.category_id,
                    product_supplier: response.data.supplier.supplier_id,
                    product_discount: response.data.discount.discount_id,
                    product_description: response.data.product_description,
                    product_images: response.data.images,
                };
                setProduct(item);
            });
        }
    }, []);

    return (
        <div className={cx('container')}>
            <Heading title={productId > 0 ? 'Cập nhật sản phẩm' : 'Thêm sản phẩm mới'} />
            <div className="mt-3">
                <div style={{ marginTop: '8px', marginBottom: '8px' }}>
                    <Button to="/products" outline leftIcon={<FontAwesomeIcon icon={faChevronLeft} />}>
                        Quay lại
                    </Button>
                </div>
                <AddForm categories={categories} suppliers={suppliers} discounts={discounts} product={product} />
            </div>
        </div>
    );
};

export default ProductAdd;
