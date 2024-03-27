import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import PropTypes from 'prop-types';

import EditForm from '~/pages/ProductEdit/partials/EditForm.jsx';
import { Heading, Wrapper, Button } from '~/components/index.js';
import { staffActions } from '~/utils/index.js';
import { CategoryService, DiscountService, SupplierService } from '~/services/index.js';

const config = {
    headers: {
        authorization: `Bearer ${staffActions.getToken()}`,
    },
};

const Content = ({ productId }) => {
    const [categories, setCategories] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [discounts, setDiscounts] = useState([]);

    const categoryService = new CategoryService(config);
    const discountService = new DiscountService(config);
    const supplierService = new SupplierService(config);

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
                        <EditForm
                            productId={productId}
                            categories={categories}
                            suppliers={suppliers}
                            discounts={discounts}
                        />
                    </>
                </Wrapper>
            </div>
        </div>
    );
};

Content.propTypes = {
    productId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default Content;
