import React from 'react';
import HelmetInstance from '../../utils/HelmetInstance';
import DefaultLayout from '../layouts/DefaultLayout';
import Home from './../components/Home/index';

const HomePage: React.FC = () => {
    return (
        <DefaultLayout>
            <HelmetInstance title="Double D Shop" />
            <Home />
        </DefaultLayout>
    );
};

export default HomePage;
