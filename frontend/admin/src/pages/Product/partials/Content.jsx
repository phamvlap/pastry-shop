import PropTypes from 'prop-types';

import { Heading, Pagination, Table } from '~/components/index.js';
import ControlPanel from '~/pages/Product/partials/ControlPanel.jsx';
import SearchBar from '~/pages/Product/partials/SearchBar.jsx';

const header = {
    hasCheckbox: true,
    product_id: {
        value: 'Mã sản phẩm',
        isModified: false,
    },
    product_name: {
        value: 'Tên sản phẩm',
        isModified: false,
    },
    product_image: {
        value: 'Hình ảnh',
        isModified: false,
    },
    product_stock_quantity: {
        value: 'Số lượng trong kho',
        isModified: false,
    },
    product_status: {
        value: 'Trạng thái',
        isModified: false,
        views: ['Còn hàng', 'Hết hàng'],
    },
    category_name: {
        value: 'Danh mục',
        isModified: false,
    },
};
const actions = {
    detail: {
        value: 'Chi tiết',
        isDirected: true,
        isModifiedInRow: false,
    },
    edit: {
        value: 'Sửa',
        isDirected: true,
        isModifiedInRow: false,
    },
};

const Content = ({
    productList,
    setProductList,
    totalPages,
    currentPage,
    setCurrentPage,
    recordsPerPage,
    setRecordsPerPage,
    recordOffset,
    setRecordsOffset,
    setCurrentFilter,
}) => {
    return (
        <div>
            <Heading title="Danh sách sản phẩm" />
            <div className="mt-3">
                <ControlPanel />
            </div>
            <div className="mt-3">
                <SearchBar setRecordsPerPage={setRecordsPerPage} setCurrentFilter={setCurrentFilter} />
            </div>
            <div className="mt-3">
                <Table
                    entityName="product"
                    header={header}
                    data={productList}
                    setData={setProductList}
                    actions={actions}
                />
            </div>
            <div className="mt-3">
                <Pagination
                    totalPages={totalPages}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    recordsPerPage={recordsPerPage}
                    setRecordsPerPage={setRecordsPerPage}
                    recordOffset={recordOffset}
                    setRecordsOffset={setRecordsOffset}
                />
            </div>
        </div>
    );
};

Content.propTypes = {
    productList: PropTypes.array,
    setProductList: PropTypes.func,
    totalPages: PropTypes.number,
    currentPage: PropTypes.number,
    setCurrentPage: PropTypes.func,
    recordsPerPage: PropTypes.number,
    setRecordsPerPage: PropTypes.func,
    recordOffset: PropTypes.number,
    setRecordsOffset: PropTypes.func,
    setCurrentFilter: PropTypes.func,
};

export default Content;
