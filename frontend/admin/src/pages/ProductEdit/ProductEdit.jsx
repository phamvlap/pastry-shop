import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

import Content from '~/pages/ProductEdit/partials/Content.jsx';
import { Wrapper } from '~/components/index.js';
import ColumnLayout from '~/layouts/ColumnLayout/ColumnLayout.jsx';

import { ProductService } from '~/services/index.js';

const ProductEdit = () => {
    const [product, setProduct] = useState({});

    const { productId } = useParams();
    const productService = new ProductService();

    // useEffect(() => {
    //     const fetchProduct = async () => {
    //         const response = await productService.get(productId);
    //         // console.log(response.data);
    //         setProduct(response.data);
    //     };
    //     fetchProduct();
    // }, []);
    // console.log('render product');

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

export default ProductEdit;
