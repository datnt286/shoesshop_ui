import React from 'react';
import { Link } from 'react-router-dom';
import imageSrc from '../../resources/img/best-product-1.jpg';

const ProductCardBig: React.FC = () => {
    return (
        <div className="col-md-6 col-lg-6 col-xl-3">
            <Link to="/san-pham">
                <div className="text-center">
                    <img src={imageSrc} className="img-fluid rounded" alt="Ảnh sản phẩm" />
                    <div className="py-4">
                        <span className="h5">Organic Tomato</span>
                        <div className="d-flex my-3 justify-content-center">
                            <i className="fas fa-star text-primary"></i>
                            <i className="fas fa-star text-primary"></i>
                            <i className="fas fa-star text-primary"></i>
                            <i className="fas fa-star text-primary"></i>
                            <i className="fas fa-star"></i>
                        </div>
                        <h4 className="mb-3">500.000</h4>
                        <button className="btn border border-secondary rounded-pill px-3 text-primary">
                            <i className="fa fa-shopping-bag me-2 text-primary"></i> Thêm vào giỏ hàng
                        </button>
                    </div>
                </div>
            </Link>
        </div>
    );
};

export default ProductCardBig;
