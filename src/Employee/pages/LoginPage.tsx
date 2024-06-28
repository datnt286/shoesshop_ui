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

const LoginPage: React.FC = () => {
    const [credentials, setCredentials] = useState({
        userName: '',
        password: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [validationErrors, setValidationErrors] = useState<{
        userName?: string;
        password?: string;
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

        if (name === 'password') {
            if (!value) {
                setValidationErrors((prevErrors) => ({
                    ...prevErrors,
                    password: 'Mật khẩu không được để trống.',
                }));
            } else {
                setValidationErrors((prevErrors) => ({ ...prevErrors, password: undefined }));
            }
        }

        setCredentials({
            ...credentials,
            [name]: value,
        });
        setError('');
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

        setValidationErrors(newErrors);

        if (Object.values(newErrors).some((error) => error)) {
            return;
        }

        try {
            const response = await AxiosInstance.post('/Users/Employee/login', credentials);

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
                                <div className="mb-3">
                                    <div className="input-group">
                                        <input
                                            name="userName"
                                            className="form-control"
                                            value={credentials.userName}
                                            onChange={handleInputChange}
                                            placeholder="Tên đăng nhập"
                                        />
                                        <div className="input-group-append">
                                            <div className="input-group-text">
                                                <span className="fas fa-user"></span>
                                            </div>
                                        </div>
                                    </div>
                                    {validationErrors.userName && (
                                        <div className="text-danger mt-1 ml-1">{validationErrors.userName}</div>
                                    )}
                                </div>
                                <div className="mb-3">
                                    <div className="input-group">
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            name="password"
                                            id="password"
                                            className="form-control"
                                            value={credentials.password}
                                            onChange={handleInputChange}
                                            placeholder="Mật khẩu"
                                        />
                                        <div className="input-group-append">
                                            <div className="input-group-text">
                                                <span className="fas fa-lock"></span>
                                            </div>
                                        </div>
                                    </div>
                                    {validationErrors.password && (
                                        <div className="text-danger mt-1 ml-1">{validationErrors.password}</div>
                                    )}
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
                                                onChange={() => setShowPassword(!showPassword)}
                                            />
                                            <label htmlFor="show-password"> Hiện mật khẩu</label>
                                        </div>
                                    </div>
                                    <div className="col-6 text-right">
                                        <button type="submit" className="btn btn-blue">
                                            <i className="fas fa-sign-in-alt"></i> Đăng nhập
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
