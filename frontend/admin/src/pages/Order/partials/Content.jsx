import PropTypes from 'prop-types';

import Heading from '~/components/Heading/Heading.jsx';
import Pagination from '~/components/Pagination/Pagination.jsx';
import Table from '~/components/Table/Table.jsx';
import ControlPanel from '~/pages/Order/partials/ControlPanel.jsx';

const header = {
    order_id: {
        value: 'Mã đơn hàng ',
        isModified: false,
    },
    order_date: {
        value: 'Ngày đặt hàng',
        isModified: false,
    },
    order_customer: {
        value: 'Khách hàng',
        isModified: false,
    },
    order_total: {
        value: 'Tổng tiền',
        isModified: false,
    },
    order_status: {
        value: 'Trạng thái',
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
    orderList,
    setProductList,
    totalPages,
    setTotalPages,
    currentPage,
    setCurrentPage,
    recordsPerPage,
    setRecordsPerPage,
    length,
}) => {
    return (
        <div>
            <Heading title="Danh sách đơn hàng" />
            <div className="mt-3">
                <ControlPanel />
            </div>
            {/*            <div className="mt-3">
                <SearchBar setRecordsPerPage={setRecordsPerPage} />
            </div> */}
            <div className="mt-3">
                <Table entityName="order" header={header} data={orderList} setData={setProductList} actions={actions} />
            </div>
            <div className="mt-3">
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    setCurrentPage={setCurrentPage}
                    length={length}
                />
            </div>
        </div>
    );
};

Content.propTypes = {
    orderList: PropTypes.array,
    setProductList: PropTypes.func,
    onChangeShowNumber: PropTypes.func,
    totalPages: PropTypes.number,
    setTotalPages: PropTypes.func,
    currentPage: PropTypes.number,
    setCurrentPage: PropTypes.func,
    recordsPerPage: PropTypes.number,
    setRecordsPerPage: PropTypes.func,
    length: PropTypes.number,
};

export default Content;
