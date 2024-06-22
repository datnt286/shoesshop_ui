import React from 'react';
import HelmetInstance from '../../utils/HelmetInstance';
import DefaultLayout from '../layouts/DefaultLayout';
import Size from './../components/Size/index';

const SizePage: React.FC = () => {
    return (
        <DefaultLayout>
            <HelmetInstance title="Size" />
            <Size />
        </DefaultLayout>
    );
};

export default SizePage;
