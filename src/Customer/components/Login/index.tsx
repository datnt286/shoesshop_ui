import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import AxiosInstance from '../../../services/AxiosInstance';

const Login: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleShowPasswordChange = () => {
        setShowPassword(!showPassword);
    };

    const handleLogin = async (event: React.FormEvent) => {
        event.preventDefault();

        try {
            const response = await AxiosInstance.post('/Users/Customer/login', {
                username,
                password,
            });

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
            setError('Đăng nhập thất bại! Vui lòng thử lại.');
            console.error('Lỗi đăng nhập: ', error);
        }
    };

    return (
        <div className="container-fluid py-5">
            <div className="container py-5">
                <form onSubmit={handleLogin}>
                    <div className="row">
                        <div className="col-md-12 col-lg-6 col-xl-6 offset-lg-3 offset-xl-3">
                            <div className="border border-1 rounded p-5">
                                <div className="form-item">
                                    <label htmlFor="username" className="form-label mb-3">
                                        Tên đăng nhập<sup>*</sup>
                                    </label>
                                    <input
                                        type="text"
                                        id="username"
                                        className="form-control"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                    />
                                </div>
                                <div className="form-item">
                                    <label htmlFor="password" className="form-label my-3">
                                        Mật khẩu<sup>*</sup>
                                    </label>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        id="password"
                                        className="form-control"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                                {error && (
                                    <div className="alert alert-danger mt-3" role="alert">
                                        {error}
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
                                        Đăng nhập
                                    </button>
                                </div>
                                <div className="d-flex justify-content-between mt-4">
                                    <button
                                        className="btn px-5 py-2 mx-2 rounded-pill text-light w-50"
                                        style={{ backgroundColor: '#dd4b39' }}
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
