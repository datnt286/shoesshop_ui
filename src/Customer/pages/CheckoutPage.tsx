import React from 'react';
import HelmetInstance from '../../utils/HelmetInstance';
import DefaultLayout from '../layouts/DefaultLayout';
import PageHeader from '../components/PageHeader/index';
import Checkout from './../components/Checkout/index';

const CheckoutPage: React.FC = () => {
    return (
        <DefaultLayout>
            <HelmetInstance title="Thanh toán" />
            <PageHeader title="Thanh Toán" />
            <Checkout />
        </DefaultLayout>
    );
};

export default CheckoutPage;
