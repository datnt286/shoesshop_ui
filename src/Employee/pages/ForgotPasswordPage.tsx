import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import axios from 'axios';
import AxiosInstance from '../../services/AxiosInstance';
import HelmetInstance from '../../utils/HelmetInstance';

import '../resources/plugins/ionicons-2.0.1/css/ionicons.min.css';
import '../resources/plugins/fontawesome-free/css/all.min.css';
import '../resources/dist/css/adminlte.min.css';

import '../resources/plugins/jquery-ui/jquery-ui.min.js';
import '../resources/plugins/bootstrap/js/bootstrap.bundle.min.js';
import '../resources/dist/js/adminlte.js';

const ForgotPasswordPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [errors, setErrors] = useState<{
        email?: string;
    }>({});

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;

        if (!value) {
            setErrors((prevErrors) => ({ ...prevErrors, email: 'Email không được để trống.' }));
        } else {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!emailRegex.test(value)) {
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    email: 'Email không hợp lệ.',
                }));
            } else {
                setErrors((prevErrors) => ({ ...prevErrors, email: undefined }));
            }
        }

        setEmail(value);
        setErrorMessage('');
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        const newErrors: {
            email?: string;
        } = {};

        if (!email) {
            newErrors.email = 'Email không được để trống.';
        }

        setErrors(newErrors);

        if (Object.values(newErrors).some((error) => error)) {
            return;
        }

        try {
            const response = await AxiosInstance.post('');

            if (response.status === 200) {
                Swal.fire({
                    title: 'Gửi email thành công!',
                    icon: 'success',
                    toast: true,
                    position: 'top-end',
                    timerProgressBar: true,
                    showConfirmButton: false,
                    timer: 1000,
                });
            }
        } catch (error) {
            console.error('Lỗi: ', error);

            if (axios.isAxiosError(error)) {
                if (error.response && error.response.status === 404) {
                    const apiError = error.response.data;

                    if (apiError === 'Email not found.') {
                        setErrorMessage('Không tìm thấy email.');
                    }
                }
            } else {
                Swal.fire({
                    title: 'Gửi email thất bại! Vui lòng thử lại.',
                    icon: 'error',
                    toast: true,
                    position: 'top-end',
                    timerProgressBar: true,
                    showConfirmButton: false,
                    timer: 3000,
                });
            }
        }
    };

    return (
        <>
            <HelmetInstance title="Quên mật khẩu" />
            <div className="hold-transition login-page">
                <div className="login-box">
                    <div className="card card-outline">
                        <div className="card-header text-center">
                            <span className="h1">Quên mật khẩu</span>
                        </div>
                        <div className="card-body">
                            <form id="form-login" onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <div className="input-group">
                                        <input
                                            name="email"
                                            className="form-control"
                                            value={email}
                                            onChange={handleInputChange}
                                            placeholder="Nhập email"
                                        />
                                    </div>
                                    {errors.email && <div className="text-danger mt-1 ml-1">{errors.email}</div>}
                                </div>
                                {errorMessage && (
                                    <div className="alert alert-danger mt-3" role="alert">
                                        {errorMessage}
                                    </div>
                                )}
                                <div className="row">
                                    <div className="col-7">
                                        <p className="mt-2">
                                            Trở lại trang
                                            <Link to="/dang-nhap"> Đăng nhập</Link>
                                        </p>
                                    </div>
                                    <div className="col-5 text-right">
                                        <button type="submit" className="btn btn-blue">
                                            Gửi email
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ForgotPasswordPage;
