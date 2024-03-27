import PropTypes from 'prop-types';
import { useState } from 'react';

import { Heading, Table } from '~/components/index.js';

const header = {
    category_name: {
        value: 'Tên danh mục',
        isModified: true,
    },
    productCount: {
        value: 'Số lượng sản phẩm',
        isModified: false,
    },
};
const actions = {
    edit: {
        value: 'Sửa',
        isDirected: false,
        isModifiedInRow: true,
    },
    delete: {
        value: 'Xóa',
        isDirected: false,
        isModifiedInRow: false,
    },
};
const fillable = ['category_id', 'category_name'];

const CategoryList = ({ categoryList, setCategoryList }) => {
    const [activeRow, setActiveRow] = useState(null);

    return (
        <div>
            <Heading title="Danh sách danh mục sản phẩm" />
            <div className="py-3 mt-3">
                <Table
                    entityName="category"
                    fillable={fillable}
                    header={header}
                    data={categoryList}
                    setData={setCategoryList}
                    actions={actions}
                    activeRow={activeRow}
                    setActiveRow={setActiveRow}
                />
            </div>
        </div>
    );
};

CategoryList.propTypes = {
    categoryList: PropTypes.array,
    setCategoryList: PropTypes.func,
};

export default CategoryList;
