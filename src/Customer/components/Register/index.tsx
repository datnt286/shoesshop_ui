import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import axios from 'axios';
import AxiosInstance from '../../../services/AxiosInstance';

const Register: React.FC = () => {
    const [credentials, setCredentials] = useState({
        userName: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [validationErrors, setValidationErrors] = useState<{
        userName?: string;
        email?: string;
        password?: string;
        confirmPassword?: string;
    }>({});
    const navigate = useNavigate();

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;

        if (name === 'userName') {
            if (!value) {
                setValidationErrors((prevErrors) => ({
                    ...prevErrors,
                    userName: 'Tên đăng nhập không được để trống.',
                }));
            } else {
                setValidationErrors((prevErrors) => ({ ...prevErrors, userName: undefined }));
            }
        }

        if (name === 'email') {
            if (!value) {
                setValidationErrors((prevErrors) => ({ ...prevErrors, email: 'Email không được để trống.' }));
            } else {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

                if (!emailRegex.test(value)) {
                    setValidationErrors((prevErrors) => ({
                        ...prevErrors,
                        email: 'Email không hợp lệ.',
                    }));
                } else {
                    setValidationErrors((prevErrors) => ({ ...prevErrors, email: undefined }));
                }
            }
        }

        if (name === 'password') {
            if (!value) {
                setValidationErrors((prevErrors) => ({ ...prevErrors, email: 'Mật khẩu không được để trống.' }));
            } else {
                const passwordRegex =
                    /^((?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])|(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[^a-zA-Z0-9])|(?=.*?[A-Z])(?=.*?[0-9])(?=.*?[^a-zA-Z0-9])|(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^a-zA-Z0-9])).{8,}$/;

                if (!passwordRegex.test(value)) {
                    setValidationErrors((prevErrors) => ({
                        ...prevErrors,
                        password:
                            'Mật khẩu phải có ít nhất 8 ký tự và chứa ít nhất một chữ cái viết hoa, một chữ cái viết thường, một chữ số hoặc ký tự đặc biệt.',
                    }));
                } else {
                    setValidationErrors((prevErrors) => ({ ...prevErrors, password: undefined }));
                }
            }
        }

        if (name === 'confirmPassword') {
            if (!value) {
                setValidationErrors((prevErrors) => ({
                    ...prevErrors,
                    confirmPassword: 'Xác nhận mật khẩu không được để trống.',
                }));
            } else {
                setValidationErrors((prevErrors) => ({ ...prevErrors, confirmPassword: undefined }));
            }
        }

        setCredentials({
            ...credentials,
            [name]: value,
        });
        setError('');
    };

    const handleShowPasswordChange = () => {
        setShowPassword(!showPassword);
    };

    const handleRegister = async (event: React.FormEvent) => {
        event.preventDefault();

        const newErrors: {
            userName?: string;
            email?: string;
            password?: string;
            confirmPassword?: string;
        } = {};

        if (!credentials.userName) {
            newErrors.userName = 'Tên đăng nhập không được để trống.';
        }

        if (!credentials.email) {
            newErrors.email = 'Email không được để trống.';
        }

        if (!credentials.password) {
            newErrors.password = 'Mật khẩu không được để trống.';
        }

        if (!credentials.confirmPassword) {
            newErrors.confirmPassword = 'Xác nhận mật khẩu không được để trống.';
        }

        setValidationErrors(newErrors);

        if (Object.values(newErrors).some((error) => error)) {
            return;
        }

        if (credentials.password !== credentials.confirmPassword) {
            setError('Mật khẩu và mật khẩu xác nhận không khớp'!);
            return;
        }

        try {
            const { confirmPassword, ...newCredentials } = credentials;
            const response = await AxiosInstance.post('/Users/Customer/register', newCredentials);

            if (response.status === 200) {
                navigate('/dang-nhap');

                Swal.fire({
                    title: 'Đăng ký thành công!',
                    icon: 'success',
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#3085d6',
                });
            }
        } catch (error) {
            console.error('Lỗi đăng ký: ', error);

            if (axios.isAxiosError(error)) {
                if (error.response && error.response.status === 409) {
                    const apiErrors = error.response.data.messages;
                    const newApiErrors: {
                        userName?: string;
                        phoneNumber?: string;
                        email?: string;
                    } = {};

                    apiErrors.forEach((errorMessage: string) => {
                        if (errorMessage.includes('DuplicateUserName')) {
                            newApiErrors.userName = 'Tên tài khoản đã tồn tại.';
                        } else if (errorMessage.includes('Email')) {
                            newApiErrors.email = 'Email đã tồn tại.';
                        }
                    });

                    setValidationErrors(newApiErrors);
                }
            } else {
                setError('Đăng ký thất bại! Vui lòng thử lại.');
            }
        }
    };

    return (
        <div className="container-fluid py-5">
            <div className="container py-5">
                <form onSubmit={handleRegister}>
                    <div className="row g-5">
                        <div className="col-md-12 col-lg-6 col-xl-6 offset-lg-3 offset-xl-3">
                            <div className="border border-1 rounded p-5">
                                <div className="form-item">
                                    <label htmlFor="username" className="form-label mb-3">
                                        Tên đăng nhập<sup>*</sup>
                                    </label>
                                    <input
                                        type="text"
                                        name="userName"
                                        id="username"
                                        className="form-control"
                                        onChange={handleInputChange}
                                    />
                                    {validationErrors.userName && (
                                        <div className="text-danger">{validationErrors.userName}</div>
                                    )}
                                </div>
                                <div className="form-item">
                                    <label htmlFor="email" className="form-label my-3">
                                        Email<sup>*</sup>
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        id="email"
                                        className="form-control"
                                        onChange={handleInputChange}
                                    />
                                    {validationErrors.email && (
                                        <div className="text-danger">{validationErrors.email}</div>
                                    )}
                                </div>
                                <div className="form-item">
                                    <label htmlFor="password" className="form-label my-3">
                                        Mật khẩu<sup>*</sup>
                                    </label>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        id="password"
                                        className="form-control"
                                        onChange={handleInputChange}
                                    />
                                    {validationErrors.password && (
                                        <div className="text-danger">{validationErrors.password}</div>
                                    )}
                                </div>
                                <div className="form-item">
                                    <label htmlFor="confirm-password" className="form-label my-3">
                                        Nhập lại Mật khẩu<sup>*</sup>
                                    </label>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        name="confirmPassword"
                                        id="confirm-password"
                                        className="form-control"
                                        onChange={handleInputChange}
                                    />
                                    {validationErrors.confirmPassword && (
                                        <div className="text-danger">{validationErrors.confirmPassword}</div>
                                    )}
                                </div>
                                {error && (
                                    <div className="alert alert-danger mt-3" role="alert">
                                        {error}
                                    </div>
                                )}
                                <div className="d-flex justify-content-center mt-3">
                                    <div className="form-check text-start">
                                        <input
                                            type="checkbox"
                                            id="show-password"
                                            className="form-check-input"
                                            onChange={handleShowPasswordChange}
                                        />
                                        <label htmlFor="show-password" className="form-check-label">
                                            Hiện mật khẩu
                                        </label>
                                    </div>
                                </div>
                                <div className="d-flex justify-content-center mt-4">
                                    <button
                                        type="submit"
                                        className="btn border border-secondary px-4 py-3 rounded-pill text-primary text-uppercase w-75"
                                    >
                                        Đăng ký
                                    </button>
                                </div>
                                <div className="d-flex justify-content-center mt-4">
                                    <span className="mx-2">Đã có tài khoản?</span>
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

export default Register;
