import React from 'react';
import HelmetInstance from '../../utils/HelmetInstance';
import DefaultLayout from '../layouts/DefaultLayout';
import Supplier from './../components/Supplier/index';

const SupplierPage: React.FC = () => {
    return (
        <DefaultLayout>
            <HelmetInstance title="Nhà cung cấp" />
            <Supplier />
        </DefaultLayout>
    );
};

export default SupplierPage;
