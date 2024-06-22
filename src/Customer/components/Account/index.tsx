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
    const [avatarPreview, setAvatarPreview] = useState(DefaultAvatar);

    useEffect(() => {
        const token = localStorage.getItem('token');

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

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const formData = new FormData();
        formData.append('userName', user.userName);
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
                localStorage.setItem('token', response.data.token);

                Swal.fire({
                    title: 'Cập nhật thông tin tài khoản thành công!',
                    icon: 'success',
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#3085d6',
                });
            }
        } catch (error) {
            console.error('Lỗi: ', error);

            Swal.fire({
                title: 'Cập nhật thông tin tài khoản thất bại! Vui lòng thử lại.',
                icon: 'error',
                confirmButtonText: 'OK',
                confirmButtonColor: '#3085d6',
            });
        }
    };

    return (
        <div className="container-fluid py-5">
            <div className="container py-5">
                <form onSubmit={handleSubmit} encType="multipart/form-data">
                    <div className="row">
                        <div className="col-md-12 col-lg-6 col-xl-6 offset-lg-3 offset-xl-3">
                            <div className="border border-1 rounded p-5">
                                <div className="row">
                                    <div className="col-md-12 col-lg-4 col-xl-4">
                                        <div className="text-center">
                                            <div className="row">
                                                <div className="col-12">
                                                    <img
                                                        src={avatarPreview}
                                                        className="img-fluid rounded-circle"
                                                        style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                                                        alt="Ảnh đại diện"
                                                    />
                                                </div>
                                                <div className="col-12">
                                                    <input
                                                        type="file"
                                                        name="avatar"
                                                        id="avatar"
                                                        className="d-none"
                                                        onChange={handleAvatarChange}
                                                    />
                                                    <label htmlFor="avatar" className="btn btn-secondary my-4">
                                                        Chọn ảnh
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-12 col-lg-8 col-xl-8">
                                        <div className="form-item">
                                            <label className="form-label mb-3">
                                                Tên đăng nhập<sup>*</sup>
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={user.userName}
                                                readOnly
                                            />
                                        </div>
                                        <div className="form-item">
                                            <label htmlFor="name" className="form-label my-3">
                                                Họ tên<sup>*</sup>
                                            </label>
                                            <input
                                                type="name"
                                                name="name"
                                                id="name"
                                                className="form-control"
                                                value={user.name}
                                                onChange={handleInputChange}
                                            />
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
                                                value={user.email}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        <div className="form-item">
                                            <label htmlFor="phone-number" className="form-label my-3">
                                                Điện thoại<sup>*</sup>
                                            </label>
                                            <input
                                                type="tel"
                                                name="phoneNumber"
                                                id="phone-number"
                                                className="form-control"
                                                value={user.phoneNumber}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        <div className="form-item">
                                            <label htmlFor="address" className="form-label my-3">
                                                Địa chỉ<sup>*</sup>
                                            </label>
                                            <textarea
                                                name="address"
                                                id="address"
                                                className="form-control"
                                                value={user.address}
                                                onChange={handleInputChange}
                                            ></textarea>
                                        </div>
                                    </div>
                                </div>

                                <div className="d-flex justify-content-center mt-4">
                                    <button
                                        type="submit"
                                        className="btn border border-secondary px-4 py-3 rounded-pill text-primary text-uppercase w-75"
                                    >
                                        Lưu
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

export default Account;
