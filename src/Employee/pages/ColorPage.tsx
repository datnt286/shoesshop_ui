import React from 'react';
import HelmetInstance from '../../utils/HelmetInstance';
import DefaultLayout from '../layouts/DefaultLayout';
import Color from '../components/Color/index';

const ColorPage: React.FC = () => {
    return (
        <DefaultLayout>
            <HelmetInstance title="Màu sắc" />
            <Color />
        </DefaultLayout>
    );
};

export default ColorPage;
