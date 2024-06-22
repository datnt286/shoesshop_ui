import React from 'react';
import serviceImage1 from '../../resources/img/service-1.png';
import serviceImage2 from '../../resources/img/service-2.jpg';
import serviceImage3 from '../../resources/img/service-3.png';

const Service: React.FC = () => {
    return (
        <div className="container-fluid service py-5">
            <div className="container py-5">
                <div className="row g-4 justify-content-center">
                    <div className="col-md-6 col-lg-4">
                        <a href="#">
                            <div className="service-item bg-secondary rounded border border-secondary">
                                <img src={serviceImage1} className="img-fluid rounded-top w-100" alt="Hình ảnh" />
                                <div className="px-4 rounded-bottom">
                                    <div className="service-content bg-primary text-center p-4 rounded">
                                        <h5 className="text-white">Fresh Apples</h5>
                                        <h3 className="mb-0">Giảm giá 20%</h3>
                                    </div>
                                </div>
                            </div>
                        </a>
                    </div>
                    <div className="col-md-6 col-lg-4">
                        <a href="#">
                            <div className="service-item bg-dark rounded border border-dark">
                                <img src={serviceImage2} className="img-fluid rounded-top w-100" alt="Hình ảnh" />
                                <div className="px-4 rounded-bottom">
                                    <div className="service-content bg-light text-center p-4 rounded">
                                        <h5 className="text-primary">Tasty Fruits</h5>
                                        <h3 className="mb-0">Miễn phí vận chuyển</h3>
                                    </div>
                                </div>
                            </div>
                        </a>
                    </div>
                    <div className="col-md-6 col-lg-4">
                        <a href="#">
                            <div className="service-item bg-primary rounded border border-primary">
                                <img src={serviceImage3} className="img-fluid rounded-top w-100" alt="Hình ảnh" />
                                <div className="px-4 rounded-bottom">
                                    <div className="service-content bg-secondary text-center p-4 rounded">
                                        <h5 className="text-white">Exotic Vegitable</h5>
                                        <h3 className="mb-0">Giảm 99.000 ₫</h3>
                                    </div>
                                </div>
                            </div>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Service;
