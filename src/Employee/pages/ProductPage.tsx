import React from 'react';
import HelmetInstance from '../../utils/HelmetInstance';
import DefaultLayout from '../layouts/DefaultLayout';
import Product from './../components/Product/index';

const ProductPage: React.FC = () => {
    return (
        <DefaultLayout>
            <HelmetInstance title="Sản phẩm" />
            <Product />
        </DefaultLayout>
    );
};

export default ProductPage;
