import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
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

interface User {
    role: string;
}

const LoginPage: React.FC = () => {
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
            const response = await AxiosInstance.post('/Users/Employee/login', credentials);

            if (response.status === 200) {
                localStorage.setItem('employeeToken', response.data.token);
                const decodedToken: User = jwtDecode<User>(response.data.token);
                const userRole = decodedToken.role;
                let url;

                switch (userRole) {
                    case 'Manager':
                        url = '/admin';
                        break;
                    case 'WarehouseStaff':
                        url = '/admin/giay';
                        break;
                    case 'SalesStaff':
                    case 'Shipper':
                        url = '/admin/hoa-don';
                        break;
                    default:
                        url = '/403';
                }

                navigate(url);

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
            console.error('Lỗi đăng nhập: ', error);

            if (axios.isAxiosError(error)) {
                if (error.response && error.response.status === 401) {
                    const apiError = error.response.data;

                    if (apiError === 'Invalid username or password.') {
                        setErrorMessage('Sai tên đăng nhập hoặc mật khẩu.');
                    } else if (apiError === 'User is not an employee.') {
                        setErrorMessage('Tài khoản không có quyền truy cập.');
                    }
                }
            } else {
                Swal.fire({
                    title: 'Đăng nhập thất bại! Vui lòng thử lại.',
                    icon: 'error',
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 3000,
                });
            }
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
                                    {errors.userName && <div className="text-danger mt-1 ml-1">{errors.userName}</div>}
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
                                    {errors.password && <div className="text-danger mt-1 ml-1">{errors.password}</div>}
                                </div>
                                {errorMessage && (
                                    <div className="alert alert-danger mt-3" role="alert">
                                        {errorMessage}
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
                                <Link to="/admin/quen-mat-khau">Quên mật khẩu?</Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default LoginPage;
