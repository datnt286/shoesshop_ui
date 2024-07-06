import React from 'react';
import PaymentImg from '../../resources/img/payment.png';

const Footer: React.FC = () => {
    return (
        <>
            <div className="container-fluid bg-primary text-white-50 footer pt-5 mt-5">
                <div className="container py-5">
                    <div className="pb-4 mb-4" style={{ borderBottom: '1px solid rgba(226, 175, 24, 0.5)' }}>
                        <div className="row g-4">
                            <div className="col-lg-3">
                                <a href="#">
                                    <h1 className="text-secondary mb-0">Double D</h1>
                                    <p className="text-secondary mb-0">Shoes Shop</p>
                                </a>
                            </div>
                            <div className="col-lg-6">
                                <div className="position-relative mx-auto">
                                    <input
                                        type="text"
                                        className="form-control border-0 w-100 py-3 px-4 rounded-pill"
                                        placeholder="Email Của Bạn"
                                    />
                                    <button
                                        type="submit"
                                        className="btn btn-secondary border-0 border-secondary py-3 px-4 position-absolute rounded-pill text-white"
                                        style={{ top: 0, right: 0 }}
                                    >
                                        Đăng Ký Ngay
                                    </button>
                                </div>
                            </div>
                            <div className="col-lg-3">
                                <div className="d-flex justify-content-end pt-3">
                                    <a href="#" className="btn btn-outline-secondary me-2 btn-md-square rounded-circle">
                                        <i className="fab fa-twitter"></i>
                                    </a>
                                    <a href="#" className="btn btn-outline-secondary me-2 btn-md-square rounded-circle">
                                        <i className="fab fa-facebook-f"></i>
                                    </a>
                                    <a href="#" className="btn btn-outline-secondary me-2 btn-md-square rounded-circle">
                                        <i className="fab fa-youtube"></i>
                                    </a>
                                    <a href="#" className="btn btn-outline-secondary btn-md-square rounded-circle">
                                        <i className="fab fa-linkedin-in"></i>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row g-5">
                        <div className="col-lg-3 col-md-6">
                            <div className="footer-item">
                                <h4 className="text-light mb-3">Why People Like us!</h4>
                                <p className="mb-4">
                                    typesetting, remaining essentially unchanged. It was popularised in the 1960s with
                                    the like Aldus PageMaker including of Lorem Ipsum.
                                </p>
                                <a
                                    href="#"
                                    className="btn btn-light border-2 border-secondary py-2 px-4 rounded-pill text-primary"
                                >
                                    Xem thêm
                                </a>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-6">
                            <div className="d-flex flex-column text-start footer-item">
                                <h4 className="text-light mb-3">Thông Tin Shop</h4>
                                <a href="#" className="btn-link">
                                    Về chúng tôi
                                </a>
                                <a href="#" className="btn-link">
                                    Liên hệ
                                </a>
                                <a href="#" className="btn-link">
                                    Chính sách bảo mật
                                </a>
                                <a href="#" className="btn-link">
                                    Điều khoản & Điều kiện
                                </a>
                                <a href="#" className="btn-link">
                                    Chính sách đổi trả
                                </a>
                                <a href="#" className="btn-link">
                                    Chăm sóc khách hàng
                                </a>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-6">
                            <div className="d-flex flex-column text-start footer-item">
                                <h4 className="text-light mb-3">Tài Khoản</h4>
                                <a href="#" className="btn-link">
                                    Thông tin tài khoản
                                </a>
                                <a href="#" className="btn-link">
                                    Giỏ hàng
                                </a>
                                <a href="#" className="btn-link">
                                    Wishlist
                                </a>
                                <a href="#" className="btn-link">
                                    Sản phẩm đã xem
                                </a>
                                <a href="#" className="btn-link">
                                    Hoá đơn đã mua
                                </a>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-6">
                            <div className="footer-item">
                                <h4 className="text-light mb-3">Liên Hệ</h4>
                                <p>Địa chỉ: 123 TP. HCM</p>
                                <p>Email: doube.d.shop@gmail.com</p>
                                <p>Điện thoại: +0123 4567 8910</p>
                                <p>Phương thức thanh toán</p>
                                <img src={PaymentImg} className="img-fluid" alt="Hình ảnh" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <button
                className="btn btn-primary border-3 border-primary rounded-circle back-to-top"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
                <i className="fa fa-arrow-up"></i>
            </button>
        </>
    );
};

export default Footer;
