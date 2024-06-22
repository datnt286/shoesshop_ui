import React from 'react';
import HelmetInstance from '../../utils/HelmetInstance';
import DefaultLayout from '../layouts/DefaultLayout';
import Model from './../components/Model/index';

const ShoesPage: React.FC = () => {
    return (
        <DefaultLayout>
            <HelmetInstance title="Giày" />
            <Model productTypeId={1} title="Quản lý giày" />
        </DefaultLayout>
    );
};

export default ShoesPage;
