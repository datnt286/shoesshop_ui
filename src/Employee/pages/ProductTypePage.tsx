import React from 'react';
import HelmetInstance from '../../utils/HelmetInstance';
import DefaultLayout from '../layouts/DefaultLayout';
import ProductType from '../components/ProductType/index';

const ProductTypePage: React.FC = () => {
    return (
        <DefaultLayout>
            <HelmetInstance title="Loại sản phẩm" />
            <ProductType />
        </DefaultLayout>
    );
};

export default ProductTypePage;
