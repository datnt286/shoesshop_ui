import React from 'react';
import HelmetInstance from '../../utils/HelmetInstance';
import DefaultLayout from '../layouts/DefaultLayout';

const HomePage: React.FC = () => {
    return (
        <DefaultLayout>
            <HelmetInstance title="Double D Shop" />
        </DefaultLayout>
    );
};

export default HomePage;
