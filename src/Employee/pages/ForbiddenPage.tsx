import React from 'react';
import { Link } from 'react-router-dom';
import HelmetInstance from '../../utils/HelmetInstance';

import '../resources/plugins/ionicons-2.0.1/css/ionicons.min.css';
import '../resources/plugins/fontawesome-free/css/all.min.css';
import '../resources/dist/css/adminlte.min.css';

const ForbiddenPage: React.FC = () => {
    return (
        <>
            <HelmetInstance title="404" />
            <div className="container-fluid py-5">
                <div className="container py-5 text-center">
                    <div className="row justify-content-center">
                        <div className="col-lg-6">
                            <i className="bi bi-exclamation-triangle display-1 text-secondary"></i>
                            <h1 className="display-1">403</h1>
                            <h1 className="mb-4">Bạn không có quyền truy cập địa chỉ này!</h1>
                            <p className="mb-4">
                                Rất tiếc, bạn không có quyền truy cập địa chỉ này! Hãy thử truy cập trang chủ hoặc liên
                                hệ quản lý.
                            </p>
                            <Link to="/admin" className="btn border-secondary rounded-pill py-3 px-5">
                                Quay lại Trang chủ
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ForbiddenPage;
