import Content from '~/pages/ProductAdd/partials/Content.jsx';
import ColumnLayout from '~/layouts/ColumnLayout/ColumnLayout.jsx';
import { Wrapper } from '~/components/index.js';

const ProductAdd = () => {
    return (
        <Wrapper padding={8}>
            <ColumnLayout
                sides={[
                    {
                        columns: 12,
                        element: <Content />,
                    },
                ]}
            />
        </Wrapper>
    );
};

export default ProductAdd;
