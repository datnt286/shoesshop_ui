import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import AxiosInstance from '../../../services/AxiosInstance';

const ForgotPassword: React.FC = () => {
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
        } = { ...errors };

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
        <div className="container-fluid py-5">
            <div className="container py-5">
                <form onSubmit={handleSubmit}>
                    <div className="row">
                        <div className="col-md-12 col-lg-6 col-xl-6 offset-lg-3 offset-xl-3">
                            <div className="border border-1 rounded p-5">
                                <div className="form-item">
                                    <label htmlFor="email" className="form-label mb-3">
                                        Email<sup>*</sup>
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        id="email"
                                        className="form-control"
                                        value={email}
                                        onChange={handleInputChange}
                                    />
                                    {errors.email && <div className="text-danger">{errors.email}</div>}
                                </div>
                                {errorMessage && (
                                    <div className="alert alert-danger mt-3" role="alert">
                                        {errorMessage}
                                    </div>
                                )}
                                <div className="d-flex justify-content-center mt-4">
                                    <button
                                        type="submit"
                                        className="btn border border-secondary px-4 py-3 rounded-pill text-primary text-uppercase w-75"
                                    >
                                        Gửi Email
                                    </button>
                                </div>
                                <div className="d-flex justify-content-center mt-4">
                                    <span className="mx-2">Trở lại trang</span>
                                    <Link to="/dang-nhap">Đăng nhập</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ForgotPassword;
