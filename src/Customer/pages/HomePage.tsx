import React from 'react';
import HelmetInstance from '../../utils/HelmetInstance';
import DefaultLayout from '../layouts/DefaultLayout';
import Hero from './../components/Hero/index';
import Service from './../components/Service/index';
import ProductSlider from './../components/ProductSlider/index';
import Banner from './../components/Banner/index';
import Bestseller from './../components/Bestseller/index';
import Fact from './../components/Fact/index';
import Features from './../components/Features/index';
import FeaturedProducts from '../components/FeaturedProducts/index';

const HomePage: React.FC = () => {
    return (
        <DefaultLayout>
            <HelmetInstance title="Double D Shop" />
            <Hero />
            <FeaturedProducts />
            <Service />
            <ProductSlider endpoint="/Models/new" title="Sản phẩm mới" />
            <Banner />
            <Bestseller />
            <Fact />
            <Features />
        </DefaultLayout>
    );
};

export default HomePage;
