import React from 'react';
import { useParams } from 'react-router-dom';
import HelmetInstance from '../../utils/HelmetInstance';
import DefaultLayout from '../layouts/DefaultLayout';
import PageHeader from '../components/PageHeader/index';
import Shop from '../components/Shop/index';

const ProductTypePage: React.FC = () => {
    const { productType } = useParams<{ productType: string }>();
    const productTypeId = Number(productType);

    return (
        <DefaultLayout>
            <HelmetInstance title="Danh mục sản phẩm" />
            <PageHeader title="Danh Mục Sản Phẩm" />
            <Shop productTypeId={productTypeId} heading="Danh mục sản phẩm" />
        </DefaultLayout>
    );
};

export default ProductTypePage;
