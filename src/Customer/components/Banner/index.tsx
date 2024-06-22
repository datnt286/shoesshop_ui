import React from 'react';
import { Link } from 'react-router-dom';
import BannerImg from '../../resources/img/banner.jpg';

const Banner: React.FC = () => {
    return (
        <div className="container-fluid banner bg-secondary my-5">
            <div className="container py-5">
                <div className="row g-4 align-items-center">
                    <div className="col-lg-6">
                        <div className="py-4">
                            <h1 className="display-3 text-white">Fresh Exotic Fruits</h1>
                            <p className="fw-normal display-3 text-dark mb-4">in Our Store</p>
                            <p className="mb-4 text-dark">
                                The generated Lorem Ipsum is therefore always free from repetition injected humour, or
                                non-characteristic words etc.
                            </p>
                            <Link
                                to="/cua-hang"
                                className="banner-btn btn btn-light border-2 border-primary rounded-pill py-3 px-5"
                            >
                                MUA NGAY
                            </Link>
                        </div>
                    </div>
                    <div className="col-lg-6">
                        <div className="position-relative">
                            <img src={BannerImg} className="img-fluid w-100 rounded" alt="Hình ảnh" />
                            <div
                                className="d-flex align-items-center justify-content-center bg-white rounded-circle position-absolute"
                                style={{ width: '140px', height: '140px', top: 0, left: 0 }}
                            >
                                <h1 style={{ fontSize: '50px' }}>-50%</h1>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Banner;
