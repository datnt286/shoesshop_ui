import React from 'react';
import { Link } from 'react-router-dom';
import imageSrc from '../../resources/img/best-product-1.jpg';

const ProductCard: React.FC = () => {
    return (
        <div className="col-md-6 col-lg-6 col-xl-3">
            <Link to="/san-pham/1">
                <div className="text-center">
                    <img src={imageSrc} className="img-fluid rounded" alt="Ảnh sản phẩm" />
                    <div className="py-4">
                        <span className="h5">Organic Tomato</span>
                        <h4 className="mt-1 mb-3">500.000</h4>
                        <button className="btn border border-secondary rounded-pill px-3 text-primary">
                            <i className="fa fa-shopping-bag me-2 text-primary"></i> Thêm vào giỏ hàng
                        </button>
                    </div>
                </div>
            </Link>
        </div>
    );
};

export default ProductCard;
