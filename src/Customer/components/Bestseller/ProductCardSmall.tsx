import React from 'react';
import { Link } from 'react-router-dom';
import imageSrc from '../../resources/img/best-product-1.jpg';

const ProductCardSmall: React.FC = () => {
    return (
        <div className="col-lg-6 col-xl-4">
            <Link to="/san-pham">
                <div className="p-4 rounded bg-light">
                    <div className="row align-items-center">
                        <div className="col-6">
                            <img src={imageSrc} className="img-fluid rounded-circle w-100" alt="Ảnh sản phẩm" />
                        </div>
                        <div className="col-6">
                            <span className="h5">Organic Tomato</span>
                            <div className="d-flex my-3">
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
                </div>
            </Link>
        </div>
    );
};

export default ProductCardSmall;
