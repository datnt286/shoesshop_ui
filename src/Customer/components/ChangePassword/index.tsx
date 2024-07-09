import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import axios from 'axios';
import AxiosInstance from '../../../services/AxiosInstance';

const ChangePassword: React.FC = () => {
    const [token, setToken] = useState<string | null>(null);
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [errors, setErrors] = useState<{
        currentPassword?: string;
        newPassword?: string;
        confirmPassword?: string;
    }>({});

    useEffect(() => {
        const token = localStorage.getItem('customerToken');
        setToken(token);
    }, []);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;

        if (name === 'currentPassword') {
            if (!value) {
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    currentPassword: 'Mật khẩu cũ không được để trống.',
                }));
            } else {
                setErrors((prevErrors) => ({ ...prevErrors, currentPassword: undefined }));
            }
        }

        if (name === 'newPassword') {
            if (!value) {
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    newPassword: 'Mật khẩu mới không được để trống.',
                }));
            } else {
                setErrors((prevErrors) => ({ ...prevErrors, newPassword: undefined }));
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

        setPasswordData({
            ...passwordData,
            [name]: value,
        });
        setErrorMessage('');
    };

    const handleChangePassword = async (event: React.FormEvent) => {
        event.preventDefault();

        const newErrors: {
            currentPassword?: string;
            newPassword?: string;
            confirmPassword?: string;
        } = {};

        if (!passwordData.currentPassword) {
            newErrors.currentPassword = 'Mật khẩu cũ không được để trống.';
        }

        if (!passwordData.newPassword) {
            newErrors.newPassword = 'Mật khẩu mới không được để trống.';
        }

        if (!passwordData.confirmPassword) {
            newErrors.confirmPassword = 'Xác nhận mật khẩu không được để trống.';
        }

        setErrors(newErrors);

        if (Object.values(newErrors).some((error) => error)) {
            return;
        }

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setErrorMessage('Mật khẩu mới và xác nhận mật khẩu không khớp.');
            return;
        }

        try {
            const { confirmPassword, ...newPasswordData } = passwordData;
            const response = await AxiosInstance.put('/Users/ChangePassword', newPasswordData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.status === 200) {
                Swal.fire({
                    title: 'Đổi mật khẩu thành công!',
                    icon: 'success',
                    toast: true,
                    position: 'top-end',
                    timerProgressBar: true,
                    showConfirmButton: false,
                    timer: 1000,
                });

                setPasswordData({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: '',
                });
                setErrorMessage('');
            }
        } catch (error) {
            console.error('Lỗi: ', error);

            if (axios.isAxiosError(error)) {
                if (error.response && error.response.status === 400) {
                    const apiErrors = error.response.data;

                    apiErrors.forEach((apiError: { code: string; description: string }) => {
                        if (apiError.code === 'PasswordMismatch') {
                            setErrorMessage('Mật khẩu hiện tại không khớp.');
                        }
                    });
                }
            } else {
                Swal.fire({
                    title: 'Đổi mật khẩu thất bại! Vui lòng thử lại.',
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
                <form onSubmit={handleChangePassword}>
                    <div className="row g-5">
                        <div className="col-md-12 col-lg-6 col-xl-6 offset-lg-3 offset-xl-3">
                            <div className="border border-1 rounded p-5">
                                <div className="form-item">
                                    <label htmlFor="current-password" className="form-label mb-3">
                                        Mật khẩu cũ<sup>*</sup>
                                    </label>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        name="currentPassword"
                                        id="current-password"
                                        className="form-control"
                                        value={passwordData.currentPassword}
                                        onChange={handleInputChange}
                                    />
                                    {errors.currentPassword && (
                                        <div className="text-danger">{errors.currentPassword}</div>
                                    )}
                                </div>
                                <div className="form-item">
                                    <label htmlFor="new-password" className="form-label my-3">
                                        Mật khẩu mới<sup>*</sup>
                                    </label>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        name="newPassword"
                                        id="new-password"
                                        className="form-control"
                                        value={passwordData.newPassword}
                                        onChange={handleInputChange}
                                    />
                                    {errors.newPassword && <div className="text-danger">{errors.newPassword}</div>}
                                </div>
                                <div className="form-item">
                                    <label htmlFor="confirm-password" className="form-label my-3">
                                        Nhập lại mật khẩu<sup>*</sup>
                                    </label>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        name="confirmPassword"
                                        id="confirm-password"
                                        className="form-control"
                                        value={passwordData.confirmPassword}
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

export default ChangePassword;
