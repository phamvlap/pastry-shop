import classNames from 'classnames/bind';
import { useParams } from 'react-router-dom';

import Content from '~/pages/ProductDetail/partials/Content.jsx';
import styles from '~/pages/ProductDetail/ProductDetail.module.scss';
import { Wrapper } from '~/components/index.js';
import ColumnLayout from '~/layouts/ColumnLayout/ColumnLayout.jsx';

const cx = classNames.bind(styles);

const ProductDetail = () => {
    const params = useParams();

    const { productId } = params;

    return (
        <Wrapper padding={8}>
            <ColumnLayout
                sides={[
                    {
                        columns: 12,
                        element: <Content productId={productId} />,
                    },
                ]}
            />
        </Wrapper>
    );
};

export default ProductDetail;
