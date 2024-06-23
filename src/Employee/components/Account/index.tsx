import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import Swal from 'sweetalert2';
import AxiosInstance from '../../../services/AxiosInstance';
import config from '../../../services/config';
import DefaultAvatar from '../../resources/img/default-avatar.jpg';

interface User {
    userName: string;
    name?: string;
    email: string;
    phoneNumber?: string;
    address?: string;
    avatar: File | null;
}

const Account: React.FC = () => {
    const [token, setToken] = useState<string | null>(null);
    const [user, setUser] = useState<User>({
        userName: '',
        name: '',
        email: '',
        phoneNumber: '',
        address: '',
        avatar: null,
    });
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [avatarPreview, setAvatarPreview] = useState(DefaultAvatar);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('employeeToken');

        if (token) {
            try {
                const decodedToken: User = jwtDecode<User>(token);

                setToken(token);
                setUser({
                    userName: decodedToken.userName,
                    name: decodedToken.name || '',
                    email: decodedToken.email,
                    phoneNumber: decodedToken.phoneNumber || '',
                    address: decodedToken.address || '',
                    avatar: null,
                });
                setAvatarPreview(
                    decodedToken.avatar ? `${config.baseURL}/images/avatar/${decodedToken.avatar}` : DefaultAvatar,
                );
            } catch (error) {
                console.error('Token không hợp lệ: ', token);
            }
        }
    }, []);

    const handleUserInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target;

        setUser({
            ...user,
            [name]: value,
        });
    };

    const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];

        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result as string);
                setUser({
                    ...user,
                    avatar: file,
                });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUpdateAccount = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const formData = new FormData();
        formData.append('name', user.name || '');
        formData.append('email', user.email);
        formData.append('phoneNumber', user.phoneNumber || '');
        formData.append('address', user.address || '');
        if (user.avatar) {
            formData.append('avatar', user.avatar);
        }

        try {
            const response = await AxiosInstance.put(`/Users/UpdateAccount`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.status === 200) {
                localStorage.setItem('employeeToken', response.data.token);

                Swal.fire({
                    title: 'Cập nhật thông tin tài khoản thành công!',
                    icon: 'success',
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 3000,
                });
            }
        } catch (error) {
            console.error('Lỗi: ', error);

            Swal.fire({
                title: 'Cập nhật thông tin tài khoản thất bại!',
                icon: 'error',
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
            });
        }
    };

    const handlePasswordInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target;

        setPasswordData({
            ...passwordData,
            [name]: value,
        });
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
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 3000,
                });

                setPasswordData({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: '',
                });
            }
        } catch (error) {
            console.error('Lỗi: ', error);

            Swal.fire({
                title: 'Đổi mật khẩu thất bại!',
                icon: 'error',
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
            });
        }
    };

    return (
        <>
            <h1 className="text-center my-4">Thông tin tài khoản</h1>

            <div className="card card-primary card-outline" style={{ minHeight: '490px' }}>
                <div className="card-header p-2">
                    <ul className="nav nav-pills">
                        <li className="nav-item">
                            <a href="#account" className="nav-link active" data-toggle="tab">
                                Tài khoản
                            </a>
                        </li>
                        <li className="nav-item">
                            <a href="#change-password" className="nav-link" data-toggle="tab">
                                Đổi mật khẩu
                            </a>
                        </li>
                    </ul>
                </div>

                <div className="card-body align-middle">
                    <div className="tab-content">
                        <div id="account" className="active tab-pane">
                            <form onSubmit={handleUpdateAccount} encType="multipart/form-data">
                                <div className="row d-flex justify-content-center">
                                    <div className="col-md-4">
                                        <div className="card-body box-profile text-center ml-4">
                                            <img
                                                src={avatarPreview}
                                                id="avatar-preview"
                                                className="profile-user-img img-fluid img-circle d-block"
                                                style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                                                alt="Ảnh đại diện"
                                            />
                                            <input
                                                type="file"
                                                name="avatar"
                                                id="avatar"
                                                className="d-none"
                                                onChange={handleAvatarChange}
                                            />
                                            <label
                                                id="btn-change-avatar"
                                                htmlFor="avatar"
                                                className="btn btn-secondary my-3 font-weight-normal"
                                            >
                                                Chọn ảnh
                                            </label>
                                            <h3 className="profile-username">Nguyễn Thành Đạt</h3>
                                            <p className="text-muted">Admin</p>
                                        </div>
                                    </div>
                                    <div className="col-md-8 mt-4">
                                        <input type="hidden" name="id" id="id" value="" />
                                        <div className="row ml-2 my-6">
                                            <label htmlFor="username" className="col-md-3 mt-2">
                                                Tên đăng nhập:{' '}
                                            </label>
                                            <div className="col-md-6">
                                                <input
                                                    type="text"
                                                    id="username"
                                                    className="form-control"
                                                    value={user.userName}
                                                    readOnly
                                                />
                                            </div>
                                        </div>
                                        <div className="row ml-2 my-4">
                                            <label htmlFor="name" className="col-md-3 mt-2">
                                                Họ tên:{' '}
                                            </label>
                                            <div className="col-md-6">
                                                <input
                                                    type="text"
                                                    name="name"
                                                    id="name"
                                                    className="form-control"
                                                    value={user.name}
                                                    onChange={handleUserInputChange}
                                                />
                                            </div>
                                        </div>
                                        <div className="row ml-2 my-4">
                                            <label htmlFor="phone-number" className="col-md-3 mt-2">
                                                Điện thoại:{' '}
                                            </label>
                                            <div className="col-md-6">
                                                <input
                                                    type="text"
                                                    name="phoneNumber"
                                                    id="phone-number"
                                                    className="form-control"
                                                    value={user.phoneNumber}
                                                    onChange={handleUserInputChange}
                                                />
                                            </div>
                                        </div>
                                        <div className="row ml-2 my-4">
                                            <label htmlFor="email" className="col-md-3 mt-2">
                                                Email:{' '}
                                            </label>
                                            <div className="col-md-6">
                                                <input
                                                    type="text"
                                                    name="email"
                                                    id="email"
                                                    className="form-control"
                                                    value={user.email}
                                                    onChange={handleUserInputChange}
                                                />
                                            </div>
                                        </div>
                                        <div className="row ml-2 my-2">
                                            <label htmlFor="address" className="col-md-3 mt-2">
                                                Địa chỉ:{' '}
                                            </label>
                                            <div className="col-md-6">
                                                <textarea
                                                    name="address"
                                                    id="address"
                                                    className="form-control"
                                                    value={user.address}
                                                    onChange={handleUserInputChange}
                                                ></textarea>
                                            </div>
                                        </div>

                                        <div className="text-center">
                                            <button type="submit" className="btn btn-primary mt-3">
                                                <i className="fas fa-check"></i> Lưu
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>

                        <div id="change-password" className="tab-pane">
                            <form onSubmit={handleChangePassword}>
                                <div className="row d-flex justify-content-center my-4">
                                    <label htmlFor="current-password" className="col-md-2 mt-2">
                                        Mật khẩu cũ:{' '}
                                    </label>
                                    <div className="col-md-5">
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            name="currentPassword"
                                            id="current-password"
                                            className="form-control"
                                            value={passwordData.currentPassword}
                                            onChange={handlePasswordInputChange}
                                        />
                                    </div>
                                </div>
                                <div className="row d-flex justify-content-center my-4">
                                    <label htmlFor="new-password" className="col-md-2 mt-2">
                                        Mật khẩu mới:{' '}
                                    </label>
                                    <div className="col-md-5">
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            name="newPassword"
                                            id="new-password"
                                            className="form-control"
                                            value={passwordData.newPassword}
                                            onChange={handlePasswordInputChange}
                                        />
                                    </div>
                                </div>
                                <div className="row d-flex justify-content-center my-2">
                                    <label htmlFor="confirm-password" className="col-md-2">
                                        Nhập lại mật khẩu:{' '}
                                    </label>
                                    <div className="col-md-5">
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            name="confirmPassword"
                                            id="confirm-password"
                                            className="form-control"
                                            value={passwordData.confirmPassword}
                                            onChange={handlePasswordInputChange}
                                        />
                                    </div>
                                </div>
                                <div className="row d-flex justify-content-center">
                                    <div id="alert-message" className="col-md-7"></div>
                                </div>

                                {error && (
                                    <div className="alert alert-danger mt-3" role="alert">
                                        {error}
                                    </div>
                                )}

                                <div className="custom-control custom-checkbox text-center my-2">
                                    <input
                                        type="checkbox"
                                        id="show-password"
                                        className="custom-control-input"
                                        onChange={handleShowPasswordChange}
                                    />
                                    <label htmlFor="show-password" className="custom-control-label">
                                        Hiện mật khẩu
                                    </label>
                                </div>
                                <div className="text-center">
                                    <button type="submit" className="btn btn-primary mt-3">
                                        <i className="fas fa-check"></i> Lưu
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Account;
