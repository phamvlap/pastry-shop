import { useState, useEffect } from 'react';

import DiscountList from '~/pages/Discount/partials/DiscountList.jsx';
import DiscountForm from '~/pages/Discount/partials/DiscountForm.jsx';
import ColumnLayout from '~/layouts/ColumnLayout/ColumnLayout.jsx';
import { Wrapper } from '~/components/index.js';
import { DiscountService, ProductService } from '~/services/index.js';
import { formatDate } from '~/utils/index.js';

const Discount = () => {
    const [discount, setDiscount] = useState({
        // discount_code: '',
        // discount_rate: '',
        // discount_limit: '',
        // discount_start: '',
        // discount_end: '',
    });
    const [discountList, setDiscountList] = useState([]);

    const discountService = new DiscountService();
    const productService = new ProductService();

    useEffect(() => {
        const fetchDiscount = async () => {
            const response = await discountService.getAll();
            let data = [];
            for (const discount of response.data) {
                const appliedCount = await productService.getForDiscount(discount.discount_id);
                data.push({
                    discount_id: discount.discount_id,
                    discount_code: discount.discount_code,
                    discount_rate: Number(discount.discount_rate).toFixed(2),
                    discount_limit: discount.discount_limit,
                    discount_applied: appliedCount.data,
                    discount_start: formatDate.convertToViewFormat(discount.discount_start),
                    discount_end: formatDate.convertToViewFormat(discount.discount_end),
                });
            }
            setDiscountList(data);
        };
        fetchDiscount();
    }, [discount]);

    return (
        <Wrapper>
            <ColumnLayout
                sides={[
                    {
                        columns: 8,
                        element: (
                            <DiscountList
                                discountList={discountList}
                                setDiscountList={setDiscountList}
                                setDiscount={setDiscount}
                            />
                        ),
                    },
                    {
                        columns: 4,
                        element: <DiscountForm discount={discount} setDiscount={setDiscount} />,
                    },
                ]}
            />
        </Wrapper>
    );
};

export default Discount;
