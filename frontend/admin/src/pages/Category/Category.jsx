import { useState, useEffect } from 'react';
import classNames from 'classnames/bind';

import CategoryList from '~/pages/Category/partials/CategoryList.jsx';
import CategoryForm from '~/pages/Category/partials/CategoryForm.jsx';
import { CategoryService, ProductService } from '~/services/index.js';

import styles from '~/pages/Category/Category.module.scss';

const cx = classNames.bind(styles);

const Category = () => {
    const [category, setCategory] = useState({
        category_name: '',
    });
    const [categoryList, setCategoryList] = useState([]);

    const categoryService = new CategoryService();
    const productService = new ProductService();

    const fetchCategory = async () => {
        const response = await categoryService.getAll();

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
    };
    useEffect(() => {
        fetchCategory();
    }, [category]);

    return (
        <div className={cx('row')}>
            <div className="col col-md-8">
                <CategoryList categoryList={categoryList} setCategoryList={setCategoryList} />
            </div>
            <div className="col col-md-4">
                <CategoryForm category={category} setCategory={setCategory} />
            </div>
        </div>
    );
};

export default Category;
