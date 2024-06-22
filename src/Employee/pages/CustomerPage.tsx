import React from 'react';
import HelmetInstance from '../../utils/HelmetInstance';
import DefaultLayout from '../layouts/DefaultLayout';
import Customer from '../components/Customer/index';

const CustomerPage: React.FC = () => {
    return (
        <DefaultLayout>
            <HelmetInstance title="Khách hàng" />
            <Customer />
        </DefaultLayout>
    );
};

export default CustomerPage;
