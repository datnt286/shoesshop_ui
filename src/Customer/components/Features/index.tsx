import React from 'react';

const Features: React.FC = () => {
    return (
        <div className="container-fluid featurs py-5">
            <div className="container py-5">
                <div className="row g-4">
                    <div className="col-md-6 col-lg-3">
                        <div className="featurs-item text-center rounded bg-light p-4">
                            <div className="featurs-icon btn-square rounded-circle bg-secondary mb-5 mx-auto">
                                <i className="fas fa-car-side fa-3x text-white"></i>
                            </div>
                            <div className="featurs-content text-center">
                                <h5>Miễn phí vận chuyển</h5>
                                <p className="mb-0">Miễn phí cho đơn hàng trên 500.000 ₫</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 col-lg-3">
                        <div className="featurs-item text-center rounded bg-light p-4">
                            <div className="featurs-icon btn-square rounded-circle bg-secondary mb-5 mx-auto">
                                <i className="fas fa-user-shield fa-3x text-white"></i>
                            </div>
                            <div className="featurs-content text-center">
                                <h5>Bảo mật thanh toán</h5>
                                <p className="mb-0">100% bảo mật thanh toán</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 col-lg-3">
                        <div className="featurs-item text-center rounded bg-light p-4">
                            <div className="featurs-icon btn-square rounded-circle bg-secondary mb-5 mx-auto">
                                <i className="fas fa-exchange-alt fa-3x text-white"></i>
                            </div>
                            <div className="featurs-content text-center">
                                <h5>Hoàn trả trong 30 ngày</h5>
                                <p className="mb-0">Đảm bảo tiền trong 30 ngày</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 col-lg-3">
                        <div className="featurs-item text-center rounded bg-light p-4">
                            <div className="featurs-icon btn-square rounded-circle bg-secondary mb-5 mx-auto">
                                <i className="fa fa-phone-alt fa-3x text-white"></i>
                            </div>
                            <div className="featurs-content text-center">
                                <h5>Hỗ trợ 24/7</h5>
                                <p className="mb-0">Hỗ trợ nhanh chóng mọi lúc</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Features;
