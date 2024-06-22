import React from 'react';
import HelmetInstance from '../../utils/HelmetInstance';
import DefaultLayout from '../layouts/DefaultLayout';
import PageHeader from '../components/PageHeader/index';
import Invoice from './../components/Invoice/index';

const InvoicePage: React.FC = () => {
    return (
        <DefaultLayout>
            <HelmetInstance title="Hoá đơn" />
            <PageHeader title="Hoá Đơn" />
            <Invoice />
        </DefaultLayout>
    );
};

export default InvoicePage;
