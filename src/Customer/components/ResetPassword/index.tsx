import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import AxiosInstance from '../../../services/AxiosInstance';

const ResetPassword: React.FC = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [errors, setErrors] = useState<{
        password?: string;
        confirmPassword?: string;
    }>({});
    const location = useLocation();
    const navigate = useNavigate();

    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get('token');
    const email = queryParams.get('email');

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;

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

        if (name === 'password') {
            setPassword(value);
        }

        if (name === 'confirmPassword') {
            setConfirmPassword(value);
        }

        setErrorMessage('');
    };

    const handleResetPassword = async (event: React.FormEvent) => {
        event.preventDefault();

        const newErrors: {
            password?: string;
            confirmPassword?: string;
        } = { ...errors };

        if (!password) {
            newErrors.password = 'Mật khẩu không được để trống.';
        }

        if (!confirmPassword) {
            newErrors.confirmPassword = 'Xác nhận mật khẩu không được để trống.';
        }

        setErrors(newErrors);

        if (Object.values(newErrors).some((error) => error)) {
            return;
        }

        if (!token || !email) {
            setErrorMessage('Sai email hoặc token.');
            return;
        }

        if (password !== confirmPassword) {
            setErrorMessage('Mật khẩu và xác nhận mật khẩu không khớp.');
            return;
        }

        try {
            const data = {
                email: decodeURIComponent(email),
                token: decodeURIComponent(token),
                password: password,
            };

            const response = await AxiosInstance.post('/Users/ResetPassword', data);

            if (response.status === 200) {
                navigate('/dang-nhap');

                Swal.fire({
                    title: 'Đặt lại mật khẩu thành công!',
                    icon: 'success',
                    toast: true,
                    position: 'top-end',
                    timerProgressBar: true,
                    showConfirmButton: false,
                    timer: 3000,
                });
            }
        } catch (error) {
            Swal.fire({
                title: 'Đặt lại mật khẩu thất bại! Vui lòng thử lại.',
                icon: 'error',
                toast: true,
                position: 'top-end',
                timerProgressBar: true,
                showConfirmButton: false,
                timer: 3000,
            });
        }
    };

    return (
        <div className="container-fluid py-5">
            <div className="container py-5">
                <form onSubmit={handleResetPassword}>
                    <div className="row g-5">
                        <div className="col-md-12 col-lg-6 col-xl-6 offset-lg-3 offset-xl-3">
                            <div className="border border-1 rounded p-5">
                                <div className="form-item">
                                    <label htmlFor="password" className="form-label mb-3">
                                        Mật khẩu mới<sup>*</sup>
                                    </label>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        id="password"
                                        className="form-control"
                                        value={password}
                                        onChange={handleInputChange}
                                    />
                                    {errors.password && <div className="text-danger">{errors.password}</div>}
                                </div>
                                <div className="form-item">
                                    <label htmlFor="confirmPassword" className="form-label my-3">
                                        Nhập lại mật khẩu<sup>*</sup>
                                    </label>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        name="confirmPassword"
                                        id="confirmPassword"
                                        className="form-control"
                                        value={confirmPassword}
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
                                            className="form-check-input"
                                            id="show-password"
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
                                        Đổi mật khẩu
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;
