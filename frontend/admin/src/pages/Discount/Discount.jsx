import { useState, useEffect } from 'react';
import classNames from 'classnames/bind';

import DiscountList from './partials/DiscountList.jsx';
import DiscountForm from './partials/DiscountForm.jsx';

import { DiscountService, ProductService } from '~/services/index.js';
import { formatDate } from '~/utils/index.js';

import styles from './Discount.module.scss';

const cx = classNames.bind(styles);

const Discount = () => {
    const [discount, setDiscount] = useState({});
    const [discountList, setDiscountList] = useState([]);

    const discountService = new DiscountService();
    const productService = new ProductService();

    useEffect(() => {
        const fetchDiscount = async () => {
            const response = await discountService.getAll();
            let data = [];
            for (const discount of response.data) {
                if (Number(discount.discount_id) > 1000) {
                    const appliedCount = await productService.getCount({
                        discount_id: discount.discount_id,
                    });
                    data.push({
                        discount_id: discount.discount_id,
                        discount_code: discount.discount_code,
                        discount_rate: parseInt(discount.discount_rate),
                        discount_limit: discount.discount_limit,
                        discount_applied: appliedCount.data,
                        discount_start: formatDate.convertToStandardFormat(discount.discount_start),
                        discount_end: formatDate.convertToStandardFormat(discount.discount_end),
                        discount_start_view: formatDate.convertToViewFormat(discount.discount_start),
                        discount_end_view: formatDate.convertToViewFormat(discount.discount_end),
                        discount_status: new Date() < new Date(discount.discount_end),
                    });
                }
            }
            setDiscountList(data);
        };
        fetchDiscount();
    }, [discount]);

    return (
        <div className={cx('discount-container')}>
            <div className="row">
                <div className={cx('col col-md-9', 'discount-container__col')}>
                    <DiscountList
                        discountList={discountList}
                        setDiscountList={setDiscountList}
                        setDiscount={setDiscount}
                    />
                </div>
                <div className={cx('col col-md-3', 'discount-container__col')}>
                    <DiscountForm discount={discount} setDiscount={setDiscount} />
                </div>
            </div>
        </div>
    );
};

export default Discount;
