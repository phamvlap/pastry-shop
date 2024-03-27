import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';

import AddForm from '~/pages/ProductAdd/partials/AddForm.jsx';
import { Heading, Wrapper, Button } from '~/components/index.js';
import { staffActions } from '~/utils/index.js';
import { CategoryService, DiscountService, SupplierService, ProductService } from '~/services/index.js';

const config = {
    headers: {
        authorization: `Bearer ${staffActions.getToken()}`,
    },
};

const Content = () => {
    const [categories, setCategories] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [discounts, setDiscounts] = useState([]);
    const [product, setProduct] = useState({});

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
    }, []);
    //console.log(categories, suppliers, discounts);

    return (
        <div>
            <Heading title="Thêm sản phẩm mới" />
            <div className="mt-3">
                <Wrapper padding={0}>
                    <>
                        <div style={{ marginTop: '8px', marginBottom: '8px' }}>
                            <Button to="/products" outline leftIcon={<FontAwesomeIcon icon={faChevronLeft} />}>
                                Quay lại
                            </Button>
                        </div>
                        <AddForm categories={categories} suppliers={suppliers} discounts={discounts} />
                    </>
                </Wrapper>
            </div>
        </div>
    );
};

export default Content;
