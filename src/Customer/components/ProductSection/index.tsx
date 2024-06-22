import React from 'react';
import ProductCard from './ProductCard';
import bannerImage from '../../resources/img/section-banner.jpg';

const ProductSection: React.FC = () => {
    return (
        <>
            <div className="col-lg-12">
                <h4 className="mb-4">Sản phẩm nổi bật</h4>
                <ProductCard />
                <ProductCard />
                <ProductCard />
                <ProductCard />
                <div className="d-flex justify-content-center my-4">
                    <a href="#" className="btn border border-secondary px-4 py-3 rounded-pill text-primary w-100">
                        Xem thêm
                    </a>
                </div>
            </div>
            <div className="col-lg-12">
                <div className="position-relative">
                    <img src={bannerImage} className="img-fluid w-100 rounded" alt="Hình ảnh" />
                    <div
                        className="position-absolute"
                        style={{ top: '50%', right: '10px', transform: 'translateY(-50%)' }}
                    ></div>
                </div>
            </div>
        </>
    );
};

export default ProductSection;
