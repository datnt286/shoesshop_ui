import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import AxiosInstance from '../../../services/AxiosInstance';

const Register: React.FC = () => {
    const [credentials, setCredentials] = useState({
        userName: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [errors, setErrors] = useState<{
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
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    userName: 'Tên đăng nhập không được để trống.',
                }));
            } else {
                setErrors((prevErrors) => ({ ...prevErrors, userName: undefined }));
            }
        }

        if (name === 'email') {
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
        }

        if (name === 'password') {
            if (!value) {
                setErrors((prevErrors) => ({ ...prevErrors, password: 'Mật khẩu không được để trống.' }));
            } else {
                const passwordRegex =
                    /^((?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])|(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[^a-zA-Z0-9])|(?=.*?[A-Z])(?=.*?[0-9])(?=.*?[^a-zA-Z0-9])|(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^a-zA-Z0-9])).{8,}$/;

                if (!passwordRegex.test(value)) {
                    setErrors((prevErrors) => ({
                        ...prevErrors,
                        password:
                            'Mật khẩu phải có ít nhất 8 ký tự và chứa ít nhất một chữ cái viết hoa, một chữ cái viết thường, một chữ số hoặc ký tự đặc biệt.',
                    }));
                } else {
                    setErrors((prevErrors) => ({ ...prevErrors, password: undefined }));
                }
            }
        }

        if (name === 'confirmPassword') {
            if (!value) {
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    confirmPassword: 'Xác nhận mật khẩu không được để trống.',
                }));
            } else {
                setErrors((prevErrors) => ({ ...prevErrors, confirmPassword: undefined }));
            }
        }

        setCredentials({
            ...credentials,
            [name]: value,
        });
        setErrorMessage('');
    };

    const handleRegister = async (event: React.FormEvent) => {
        event.preventDefault();

        const newErrors: {
            userName?: string;
            email?: string;
            password?: string;
            confirmPassword?: string;
        } = { ...errors };

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

        setErrors(newErrors);

        if (Object.values(newErrors).some((error) => error)) {
            return;
        }

        if (credentials.password !== credentials.confirmPassword) {
            setErrorMessage('Mật khẩu và xác nhận mật khẩu không khớp'!);
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
                    toast: true,
                    position: 'top-end',
                    timerProgressBar: true,
                    showConfirmButton: false,
                    timer: 1000,
                });
            }
        } catch (error) {
            console.error('Lỗi đăng ký: ', error);

            if (axios.isAxiosError(error)) {
                if (error.response && error.response.status === 409) {
                    const apiErrors = error.response.data.messages;
                    const newApiErrors: {
                        userName?: string;
                        email?: string;
                    } = {};

                    apiErrors.forEach((errorMessage: string) => {
                        if (errorMessage.includes('DuplicateUserName')) {
                            newApiErrors.userName = 'Tên đăng nhập đã tồn tại.';
                        } else if (errorMessage.includes('Email')) {
                            newApiErrors.email = 'Email đã tồn tại.';
                        }
                    });

                    setErrors(newApiErrors);
                }
            } else {
                Swal.fire({
                    title: 'Đăng ký thất bại! Vui lòng thử lại.',
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
                                    {errors.userName && <div className="text-danger">{errors.userName}</div>}
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
                                    {errors.email && <div className="text-danger">{errors.email}</div>}
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
                                    {errors.password && <div className="text-danger">{errors.password}</div>}
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
                                    {errors.confirmPassword && (
                                        <div className="text-danger">{errors.confirmPassword}</div>
                                    )}
                                </div>
                                {errorMessage && (
                                    <div className="alert alert-danger mt-3" role="alert">
                                        {errorMessage}
                                    </div>
                                )}
                                <div className="d-flex justify-content-center mt-3">
                                    <div className="form-check text-start">
                                        <input
                                            type="checkbox"
                                            id="show-password"
                                            className="form-check-input"
                                            onChange={() => setShowPassword(!showPassword)}
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
