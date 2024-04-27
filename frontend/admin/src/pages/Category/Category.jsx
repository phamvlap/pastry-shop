import { useState, useEffect } from 'react';
import classNames from 'classnames/bind';

import CategoryList from './partials/CategoryList.jsx';
import CategoryForm from './partials/CategoryForm.jsx';

import { CategoryService, ProductService } from '~/services/index.js';

import styles from './Category.module.scss';

const cx = classNames.bind(styles);

const Category = () => {
    const [category, setCategory] = useState();
    const [categoryList, setCategoryList] = useState([]);

    const categoryService = new CategoryService();
    const productService = new ProductService();

    const fetchCategory = async () => {
        const response = await categoryService.getAll();

        if (response.status === 'success') {
            let data = [];
            for (const category of response.data) {
                const response = await productService.getCount({
                    category_id: category.category_id,
                });
                const count = response.data;
                data.push({
                    category_id: category.category_id,
                    category_name: category.category_name,
                    productCount: count,
                });
            }
            setCategoryList(data);
        }
    };
    useEffect(() => {
        fetchCategory();
    }, [category]);

    return (
        <div className={cx('category-container')}>
            <div className={cx('row', 'container-row')}>
                <div className={cx('col col-md-8', 'container-col')}>
                    <CategoryList categoryList={categoryList} setCategoryList={setCategoryList} />
                </div>
                <div className={cx('col col-md-4', 'container-col')}>
                    <CategoryForm category={category} setCategory={setCategory} />
                </div>
            </div>
        </div>
    );
};

export default Category;
