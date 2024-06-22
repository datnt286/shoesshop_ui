import React from 'react';
import HelmetInstance from '../../utils/HelmetInstance';
import DefaultLayout from '../layouts/DefaultLayout';
import Brand from './../components/Brand/index';

const BrandPage: React.FC = () => {
    return (
        <DefaultLayout>
            <HelmetInstance title="Nhãn hiệu" />
            <Brand />
        </DefaultLayout>
    );
};

export default BrandPage;
