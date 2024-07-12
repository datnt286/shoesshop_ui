import React from 'react';

const Contact: React.FC = () => {
    return (
        <div className="container-fluid contact py-5">
            <div className="container py-5">
                <div className="p-5 bg-light rounded">
                    <div className="row g-4">
                        <div className="col-lg-12">
                            <div className="h-100 rounded">
                                <iframe
                                    title="location"
                                    className="rounded w-100"
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.513865411049!2d106.69867477316934!3d10.771899359281024!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f40a3b49e59%3A0xa1bd14e483a602db!2zVHLGsOG7nW5nIENhbyDEkeG6s25nIEvhu7kgdGh14bqtdCBDYW8gVGjhuq9uZw!5e0!3m2!1svi!2s!4v1715236985008!5m2!1svi!2s"
                                    style={{ height: '400px' }}
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                ></iframe>
                            </div>
                        </div>
                        <div className="col-lg-7">
                            <form>
                                <input
                                    type="text"
                                    className="w-100 form-control border-0 py-3 mb-4"
                                    placeholder="Họ tên"
                                />
                                <input
                                    type="email"
                                    className="w-100 form-control border-0 py-3 mb-4"
                                    placeholder="Email"
                                />
                                <textarea
                                    className="w-100 form-control border-0 mb-4"
                                    rows={5}
                                    cols={10}
                                    placeholder="Nội dung"
                                ></textarea>
                                <button
                                    type="submit"
                                    className="w-100 btn form-control border-secondary py-3 bg-white text-primary "
                                >
                                    Xác nhận
                                </button>
                            </form>
                        </div>
                        <div className="col-lg-5">
                            <div className="d-flex p-4 rounded mb-4 bg-white">
                                <i className="fas fa-map-marker-alt fa-2x text-primary me-4"></i>
                                <div>
                                    <h4>Địa chỉ</h4>
                                    <p className="mb-2">123 TP. HCM</p>
                                </div>
                            </div>
                            <div className="d-flex p-4 rounded mb-4 bg-white">
                                <i className="fas fa-envelope fa-2x text-primary me-4"></i>
                                <div>
                                    <h4>Email</h4>
                                    <p className="mb-2">doube.d.shop@gmail.com</p>
                                </div>
                            </div>
                            <div className="d-flex p-4 rounded bg-white">
                                <i className="fa fa-phone-alt fa-2x text-primary me-4"></i>
                                <div>
                                    <h4>Điện thoại</h4>
                                    <p className="mb-2">(+084) 0123 456 789</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
