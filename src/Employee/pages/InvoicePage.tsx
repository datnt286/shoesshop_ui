import React from 'react';
import HelmetInstance from '../../utils/HelmetInstance';
import DefaultLayout from '../layouts/DefaultLayout';
import Invoice from '../components/Invoice/index';

const InvoicePage: React.FC = () => {
    return (
        <DefaultLayout>
            <HelmetInstance title="Hoá đơn" />
            <Invoice />
        </DefaultLayout>
    );
};

export default InvoicePage;
