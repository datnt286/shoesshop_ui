import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import axios from 'axios';
import AxiosInstance from '../../../services/AxiosInstance';

const Login: React.FC = () => {
    const [credentials, setCredentials] = useState({
        userName: '',
        password: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [errors, setErrors] = useState<{
        userName?: string;
        password?: string;
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

        if (name === 'password') {
            if (!value) {
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    password: 'Mật khẩu không được để trống.',
                }));
            } else {
                setErrors((prevErrors) => ({ ...prevErrors, password: undefined }));
            }
        }

        setCredentials({
            ...credentials,
            [name]: value,
        });
        setErrorMessage('');
    };

    const handleLogin = async (event: React.FormEvent) => {
        event.preventDefault();

        const newErrors: {
            userName?: string;
            password?: string;
        } = {};

        if (!credentials.userName) {
            newErrors.userName = 'Tên đăng nhập không được để trống.';
        }

        if (!credentials.password) {
            newErrors.password = 'Mật khẩu không được để trống.';
        }

        setErrors(newErrors);

        if (Object.values(newErrors).some((error) => error)) {
            return;
        }

        try {
            const response = await AxiosInstance.post('/Users/Customer/login', credentials);

            if (response.status === 200) {
                localStorage.setItem('customerToken', response.data.token);
                navigate('/');

                Swal.fire({
                    title: 'Đăng nhập thành công!',
                    icon: 'success',
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#3085d6',
                });
            }
        } catch (error) {
            console.error('Lỗi đăng nhập: ', error);

            if (axios.isAxiosError(error)) {
                if (error.response && error.response.status === 401) {
                    const apiError = error.response.data;

                    if (apiError === 'Invalid username or password.') {
                        setErrorMessage('Sai tên đăng nhập hoặc mật khẩu.');
                    }
                }
            } else {
                Swal.fire({
                    title: 'Đăng nhập thất bại! Vui lòng thử lại.',
                    icon: 'error',
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#3085d6',
                });
            }
        }
    };

    const handleGoogleLogin = async (event: React.FormEvent) => {
        event.preventDefault();

        try {
            const response = await AxiosInstance.get('/Users/google-login');
        
            
        } catch (error) {
            console.error('Lỗi đăng nhập: ', error);

            Swal.fire({
                title: 'Đăng nhập thất bại! Vui lòng thử lại.',
                icon: 'error',
                confirmButtonText: 'OK',
                confirmButtonColor: '#3085d6',
            });
        }
    };

    return (
        <div className="container-fluid py-5">
            <div className="container py-5">
                <form>
                    <div className="row">
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
                                        value={credentials.userName}
                                        onChange={handleInputChange}
                                    />
                                    {errors.userName && <div className="text-danger">{errors.userName}</div>}
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
                                        value={credentials.password}
                                        onChange={handleInputChange}
                                    />
                                    {errors.password && <div className="text-danger">{errors.password}</div>}
                                </div>
                                {errorMessage && (
                                    <div className="alert alert-danger mt-3" role="alert">
                                        {errorMessage}
                                    </div>
                                )}
                                <div className="d-flex justify-content-between mt-3">
                                    <Link to="/quen-mat-khau">
                                        <span>Quên mật khẩu?</span>
                                    </Link>
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
                                        onClick={handleLogin}
                                    >
                                        Đăng nhập
                                    </button>
                                </div>
                                <div className="d-flex justify-content-between mt-4">
                                    <button
                                        className="btn px-5 py-2 mx-2 rounded-pill text-light w-50"
                                        style={{ backgroundColor: '#dd4b39' }}
                                        onClick={handleGoogleLogin}
                                    >
                                        <i className="fab fa-google"></i> Google
                                    </button>
                                    <button
                                        className="btn px-5 py-2 mx-2 rounded-pill text-light w-50"
                                        style={{ backgroundColor: '#0866ff' }}
                                    >
                                        <i className="fab fa-facebook-square"></i> Facebook
                                    </button>
                                </div>
                                <div className="d-flex justify-content-center mt-4">
                                    <span className="mx-2">Chưa có tài khoản?</span>
                                    <Link to="/dang-ky">Đăng ký</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
