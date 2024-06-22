import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import AxiosInstance from '../../../services/AxiosInstance';

const ChangePassword: React.FC = () => {
    const [token, setToken] = useState<string | null>(null);
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        setToken(token);
    }, []);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;

        setPasswordData({
            ...passwordData,
            [name]: value,
        });
        setError('');
    };

    const handleShowPasswordChange = () => {
        setShowPassword(!showPassword);
    };

    const handleChangePassword = async (event: React.FormEvent) => {
        event.preventDefault();

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setError('Mật khẩu và mật khẩu xác nhận không khớp'!);
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
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#3085d6',
                });

                setPasswordData({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: '',
                });
            }
        } catch (error) {
            setError('Đổi mật khẩu thất bại! Vui lòng thử lại.');
            console.error('Lỗi: ', error);
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
                                            className="form-check-input"
                                            id="show-password"
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
