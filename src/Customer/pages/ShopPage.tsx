import React from 'react';
import HelmetInstance from '../../utils/HelmetInstance';
import DefaultLayout from '../layouts/DefaultLayout';
import PageHeader from '../components/PageHeader/index';
import Shop from '../components/Shop/index';

const ShopPage: React.FC = () => {
    return (
        <DefaultLayout>
            <HelmetInstance title="Cửa hàng" />
            <PageHeader title="Cửa Hàng" />
            <Shop heading="Tất cả sản phẩm" />
        </DefaultLayout>
    );
};

export default ShopPage;
