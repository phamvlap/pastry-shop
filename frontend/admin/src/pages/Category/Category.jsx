import { useState, useEffect } from 'react';

import CategoryList from '~/pages/Category/partials/CategoryList.jsx';
import CategoryForm from '~/pages/Category/partials/CategoryForm.jsx';
import { Wrapper } from '~/components/index.js';
import { CategoryService, ProductService } from '~/services/index.js';
import ColumnLayout from '~/layouts/ColumnLayout/ColumnLayout.jsx';

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
            const response = await productService.getForCateogry(category.category_id);
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
        <Wrapper>
            <ColumnLayout
                sides={[
                    {
                        columns: 12,
                        element: (
                            <ColumnLayout
                                sides={[
                                    {
                                        columns: 6,
                                        element: (
                                            <CategoryList
                                                categoryList={categoryList}
                                                setCategoryList={setCategoryList}
                                            />
                                        ),
                                    },
                                    {
                                        columns: 6,
                                        element: <CategoryForm category={category} setCategory={setCategory} />,
                                    },
                                ]}
                            />
                        ),
                    },
                ]}
            />
        </Wrapper>
    );
};

export default Category;
