import React from 'react';
import { Link } from 'react-router-dom';
import imageSrc from '../../resources/img/nike_air_max.png';

const ProductCard: React.FC = () => {
    return (
        <Link to={`/san-pham/1`}>
            <div className="d-flex align-items-center justify-content-start">
                <div className="rounded" style={{ width: '100px', height: '100px' }}>
                    <img
                        src={imageSrc}
                        className="img-fluid rounded"
                        style={{ objectFit: 'cover' }}
                        alt="Ảnh sản phẩm"
                    />
                </div>
                <div className="mx-2">
                    <h6 className="mb-2">Big Banana</h6>
                    <div className="d-flex mb-2">
                        <i className="fa fa-star text-secondary"></i>
                        <i className="fa fa-star text-secondary"></i>
                        <i className="fa fa-star text-secondary"></i>
                        <i className="fa fa-star text-secondary"></i>
                        <i className="fa fa-star"></i>
                    </div>
                    <div className="d-flex mb-2">
                        <h5 className="fw-bold me-2">500.000 ₫</h5>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default ProductCard;
