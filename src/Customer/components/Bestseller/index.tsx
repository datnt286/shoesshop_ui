import React from 'react';
import bestProduct1 from '../../resources/img/best-product-1.jpg';
import ProductCardBig from './ProductCardBig';
import ProductCardSmall from './ProductCardSmall';

const Bestseller: React.FC = () => {
    return (
        <div className="container-fluid py-5">
            <div className="container py-5">
                <div className="text-center mx-auto mb-5" style={{ maxWidth: '700px' }}>
                    <h1 className="display-4">Sản phẩm bán chạy</h1>
                </div>
                <div className="row g-4">
                    <ProductCardSmall />
                    <ProductCardSmall />
                    <ProductCardSmall />
                    <ProductCardSmall />
                    <ProductCardSmall />
                    <ProductCardSmall />
                    <ProductCardBig />
                    <ProductCardBig />
                    <ProductCardBig />
                    <ProductCardBig />
                </div>
            </div>
        </div>
    );
};

export default Bestseller;
