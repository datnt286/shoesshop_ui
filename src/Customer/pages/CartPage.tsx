import React from 'react';
import HelmetInstance from '../../utils/HelmetInstance';
import DefaultLayout from '../layouts/DefaultLayout';
import PageHeader from '../components/PageHeader/index';
import Cart from './../components/Cart/index';

const CartPage: React.FC = () => {
    return (
        <DefaultLayout>
            <HelmetInstance title="Giỏ hàng" />
            <PageHeader title="Giỏ Hàng" />
            <Cart />
        </DefaultLayout>
    );
};

export default CartPage;
