import React from 'react';
import HelmetInstance from '../../utils/HelmetInstance';
import DefaultLayout from '../layouts/DefaultLayout';
import Model from './../components/Model/index';

const AccessoriesPage: React.FC = () => {
    return (
        <DefaultLayout>
            <HelmetInstance title="Phụ kiện" />
            <Model productTypeId={2} title="Quản lý phụ kiện" />
        </DefaultLayout>
    );
};

export default AccessoriesPage;
