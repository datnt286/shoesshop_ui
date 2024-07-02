import React from 'react';
import HelmetInstance from '../../utils/HelmetInstance';
import DefaultLayout from '../layouts/DefaultLayout';
import Slider from '../components/Slider/index';

const SliderPage: React.FC = () => {
    return (
        <DefaultLayout>
            <HelmetInstance title="Slider" />
            <Slider />
        </DefaultLayout>
    );
};

export default SliderPage;
