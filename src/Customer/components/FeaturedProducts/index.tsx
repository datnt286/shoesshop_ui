import React from 'react';
import ProductCard from './ProductCard';

const FeaturedProducts: React.FC = () => {
    return (
        <div className="container-fluid product py-5">
            <div className="container py-5">
                <div className="tab-class text-center">
                    <div className="row g-4">
                        <div className="col-lg-4 text-start">
                            <h1>Sản phẩm nổi bật</h1>
                        </div>
                        <div className="col-lg-8 text-end">
                            <ul className="nav nav-pills d-inline-flex text-center mb-5">
                                <li className="nav-item">
                                    <a
                                        href="#tab-1"
                                        className="d-flex m-2 py-2 bg-light rounded-pill active"
                                        data-bs-toggle="pill"
                                    >
                                        <span className="text-dark" style={{ width: '130px' }}>
                                            Tất cả
                                        </span>
                                    </a>
                                </li>
                                <li className="nav-item">
                                    <a
                                        href="#tab-2"
                                        className="d-flex py-2 m-2 bg-light rounded-pill"
                                        data-bs-toggle="pill"
                                    >
                                        <span className="text-dark" style={{ width: '130px' }}>
                                            Vegetables
                                        </span>
                                    </a>
                                </li>
                                <li className="nav-item">
                                    <a
                                        href="#tab-3"
                                        className="d-flex m-2 py-2 bg-light rounded-pill"
                                        data-bs-toggle="pill"
                                    >
                                        <span className="text-dark" style={{ width: '130px' }}>
                                            Fruits
                                        </span>
                                    </a>
                                </li>
                                <li className="nav-item">
                                    <a
                                        href="#tab-4"
                                        className="d-flex m-2 py-2 bg-light rounded-pill"
                                        data-bs-toggle="pill"
                                    >
                                        <span className="text-dark" style={{ width: '130px' }}>
                                            Bread
                                        </span>
                                    </a>
                                </li>
                                <li className="nav-item">
                                    <a
                                        href="#tab-5"
                                        className="d-flex m-2 py-2 bg-light rounded-pill"
                                        data-bs-toggle="pill"
                                    >
                                        <span className="text-dark" style={{ width: '130px' }}>
                                            Meat
                                        </span>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="tab-content">
                        <div id="tab-1" className="tab-pane fade show p-0 active">
                            <div className="row g-4">
                                <div className="col-lg-12">
                                    <div className="row g-4">
                                        <ProductCard />
                                        <ProductCard />
                                        <ProductCard />
                                        <ProductCard />
                                        <ProductCard />
                                        <ProductCard />
                                        <ProductCard />
                                        <ProductCard />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div id="tab-2" className="tab-pane fade show p-0">
                            <div className="row g-4">
                                <div className="col-lg-12">
                                    <div className="row g-4">
                                        <ProductCard />
                                        <ProductCard />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div id="tab-3" className="tab-pane fade show p-0">
                            <div className="row g-4">
                                <div className="col-lg-12">
                                    <div className="row g-4">
                                        <ProductCard />
                                        <ProductCard />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div id="tab-4" className="tab-pane fade show p-0">
                            <div className="row g-4">
                                <div className="col-lg-12">
                                    <div className="row g-4">
                                        <ProductCard />
                                        <ProductCard />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div id="tab-5" className="tab-pane fade show p-0">
                            <div className="row g-4">
                                <div className="col-lg-12">
                                    <div className="row g-4">
                                        <ProductCard />
                                        <ProductCard />
                                        <ProductCard />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FeaturedProducts;
