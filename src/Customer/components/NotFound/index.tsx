import React from 'react';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
    return (
        <div className="container-fluid py-5">
            <div className="container py-5 text-center">
                <div className="row justify-content-center">
                    <div className="col-lg-6">
                        <i className="bi bi-exclamation-triangle display-1 text-secondary"></i>
                        <h1 className="display-1">404</h1>
                        <h1 className="mb-4">Không tìm thấy trang!</h1>
                        <p className="mb-4">
                            Rất tiếc, trang bạn tìm kiếm không tồn tại! Hãy thử truy cập trang chủ hoặc sử dụng thanh
                            tìm kiếm.
                        </p>
                        <Link to="/" className="btn border-secondary rounded-pill py-3 px-5">
                            Quay lại Trang chủ
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotFound;
