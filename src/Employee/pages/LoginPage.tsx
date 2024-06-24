import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import AxiosInstance from '../../services/AxiosInstance';
import HelmetInstance from '../../utils/HelmetInstance';

import '../resources/plugins/ionicons-2.0.1/css/ionicons.min.css';
import '../resources/plugins/fontawesome-free/css/all.min.css';
import '../resources/dist/css/adminlte.min.css';

import '../resources/plugins/jquery-ui/jquery-ui.min.js';
import '../resources/plugins/bootstrap/js/bootstrap.bundle.min.js';
import '../resources/dist/js/adminlte.js';
// import '../resources/dist/js/demo.js';

const LoginPage: React.FC = () => {
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
            const response = await AxiosInstance.post('/Users/Employee/login', { username, password });

            if (response.status === 200) {
                localStorage.setItem('employeeToken', response.data.token);
                navigate('/admin');

                Swal.fire({
                    title: 'Đăng nhập thành công!',
                    icon: 'success',
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 3000,
                });
            }
        } catch (error) {
            setError('Đăng nhập thất bại! Vui lòng thử lại.');
            console.error('Lỗi đăng nhập: ', error);
        }
    };

    return (
        <>
            <HelmetInstance title="Đăng nhập" />
            <div className="hold-transition login-page">
                <div className="login-box">
                    <div className="card card-outline">
                        <div className="card-header text-center">
                            <span className="h1">Đăng nhập</span>
                        </div>
                        <div className="card-body">
                            <form id="form-login" onSubmit={handleLogin}>
                                <div className="input-group mb-3">
                                    <input
                                        name="username"
                                        className="form-control"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        placeholder="Tên đăng nhập"
                                    />
                                    <div className="input-group-append">
                                        <div className="input-group-text">
                                            <span className="fas fa-user"></span>
                                        </div>
                                    </div>
                                </div>
                                <div className="input-group mb-3">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        id="password"
                                        className="form-control"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Mật khẩu"
                                    />
                                    <div className="input-group-append">
                                        <div className="input-group-text">
                                            <span className="fas fa-lock"></span>
                                        </div>
                                    </div>
                                </div>

                                {error && (
                                    <div className="alert alert-danger mt-3" role="alert">
                                        {error}
                                    </div>
                                )}

                                <div className="row">
                                    <div className="col-6">
                                        <div className="icheck-primary">
                                            <input
                                                type="checkbox"
                                                id="show-password"
                                                className="mr-1"
                                                onChange={handleShowPasswordChange}
                                            />
                                            <label htmlFor="show-password">Hiện mật khẩu</label>
                                        </div>
                                    </div>
                                    <div className="col-6 text-right">
                                        <button type="submit" className="btn btn-blue">
                                            <i className="fas fa-sign-in-alt mr-1"></i>
                                            Đăng nhập
                                        </button>
                                    </div>
                                </div>
                            </form>
                            <p className="mb-1">
                                <a href="#">Quên mật khẩu?</a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default LoginPage;
