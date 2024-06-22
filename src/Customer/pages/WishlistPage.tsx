import React from 'react';
import HelmetInstance from '../../utils/HelmetInstance';
import DefaultLayout from '../layouts/DefaultLayout';
import PageHeader from '../components/PageHeader/index';
import Wishlist from '../components/Wishlist/index';

const WishlistPage: React.FC = () => {
    return (
        <DefaultLayout>
            <HelmetInstance title="Wishlist" />
            <PageHeader title="Wishlist" />
            <Wishlist />
        </DefaultLayout>
    );
};

export default WishlistPage;
