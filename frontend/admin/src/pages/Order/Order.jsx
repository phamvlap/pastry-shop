import Content from '~/pages/Order/partials/Content.jsx';
import Wrapper from '~/components/Wrapper/Wrapper.jsx';
import ColumnLayout from '~/layouts/ColumnLayout/ColumnLayout.jsx';

const Order = () => {
    return (
        <Wrapper padding={8}>
            <ColumnLayout
                sides={[
                    {
                        columns: 12,
                        element: (
                            <Content
                            // productList={productList}
                            // setProductList={setProductList}
                            // totalPages={totalPages}
                            // setTotalPages={setTotalPages}
                            // currentPage={currentPage}
                            // setCurrentPage={setCurrentPage}
                            // recordsPerPage={recordsPerPage}
                            // setRecordsPerPage={setRecordsPerPage}
                            // length={length}
                            />
                        ),
                    },
                ]}
            />
        </Wrapper>
    );
};

export default Order;
