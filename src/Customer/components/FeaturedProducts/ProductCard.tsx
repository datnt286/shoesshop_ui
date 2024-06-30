import React from 'react';
import { Link } from 'react-router-dom';
import imageSrc from '../../resources/img/nike_air_max.png';

const ProductCard: React.FC = () => {
    return (
        <div className="col-md-6 col-lg-4 col-xl-3">
            <Link to={`/san-pham/1`}>
                <div className="rounded position-relative fruite-item">
                    <div className="fruite-img">
                        <img src={imageSrc} className="img-fluid w-100 rounded-top" alt="Ảnh sản phẩm" />
                    </div>
                    <div
                        className="text-white bg-danger px-3 py-1 rounded position-absolute"
                        style={{ top: '10px', left: '10px' }}
                    >
                        -20%
                    </div>
                    <button
                        className="btn border border-secondary rounded-pill px-3 py-2 ml-3 mb-4 text-primary position-absolute"
                        style={{ top: '10px', right: '10px' }}
                    >
                        <i className="far fa-heart"></i>
                    </button>
                    <div className="p-4 border border-secondary border-top-0 rounded-bottom">
                        <h4>Grapes</h4>
                        <div className="d-flex justify-content-between flex-lg-wrap">
                            <p className="text-dark fs-5 fw-bold mb-0">500.000 ₫</p>
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

export default ProductCard;
