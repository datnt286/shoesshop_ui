import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import Swal from 'sweetalert2';
import axios from 'axios';
import AxiosInstance from '../../../services/AxiosInstance';
import config from '../../../services/config';
import DefaultAvatar from '../../resources/img/default-avatar.jpg';

const ALLOWED_IMAGE_TYPES = ['image/jpg', 'image/jpeg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE = 2 * 1024 * 1024;

interface User {
    userName: string;
    name?: string;
    email: string;
    phoneNumber?: string;
    address?: string;
    avatar: File | null;
    role?: string;
}

interface City {
    Id: string;
    Name: string;
    Districts: District[];
}

interface District {
    Id: string;
    Name: string;
    Wards: Ward[];
}

interface Ward {
    Id: string;
    Name: string;
}

const Account: React.FC = () => {
    const [token, setToken] = useState<string | null>(null);
    const [userData, setUserData] = useState<User>({
        userName: '',
        name: '',
        phoneNumber: '',
        email: '',
        address: '',
        avatar: null,
        role: '',
    });
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [avatarPreview, setAvatarPreview] = useState(DefaultAvatar);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');

    const [cities, setCities] = useState<City[]>([]);
    const [districts, setDistricts] = useState<District[]>([]);
    const [wards, setWards] = useState<Ward[]>([]);
    const [selectedCity, setSelectedCity] = useState<string>('');
    const [selectedDistrict, setSelectedDistrict] = useState<string>('');
    const [selectedWard, setSelectedWard] = useState<string>('');

    const [userErrors, setUserErrors] = useState<{
        name?: string;
        phoneNumber?: string;
        email?: string;
        city?: string;
        district?: string;
        ward?: string;
        avatar?: string;
    }>({});

    const [passwordErrors, setPasswordErrors] = useState<{
        currentPassword?: string;
        newPassword?: string;
        confirmPassword?: string;
    }>({});

    useEffect(() => {
        const token = localStorage.getItem('employeeToken');

        if (token) {
            try {
                const decodedToken: User = jwtDecode<User>(token);

                setToken(token);
                setUserData({
                    userName: decodedToken.userName,
                    name: decodedToken.name || '',
                    phoneNumber: decodedToken.phoneNumber || '',
                    email: decodedToken.email,
                    address: decodedToken.address || '',
                    avatar: null,
                    role: decodedToken.role || '',
                });
                setAvatarPreview(
                    decodedToken.avatar ? `${config.baseURL}/images/avatar/${decodedToken.avatar}` : DefaultAvatar,
                );

                fetch('/address_data.json')
                    .then((response) => response.json())
                    .then((data) => {
                        setCities(data);

                        if (decodedToken.address) {
                            const addressParts = decodedToken.address.split(',').map((part) => part.trim());
                            const wardName = addressParts[0];
                            const districtName = addressParts[1];
                            const cityName = addressParts[2];

                            const selectedCity = data.find((city: City) => city.Name === cityName);
                            if (selectedCity) {
                                setSelectedCity(selectedCity.Name);
                                setDistricts(selectedCity.Districts);

                                const selectedDistrict = selectedCity.Districts.find(
                                    (district: District) => district.Name === districtName,
                                );

                                if (selectedDistrict) {
                                    setSelectedDistrict(selectedDistrict.Name);
                                    setWards(selectedDistrict.Wards);

                                    const selectedWard = selectedDistrict.Wards.find(
                                        (ward: Ward) => ward.Name === wardName,
                                    );

                                    if (selectedWard) {
                                        setSelectedWard(selectedWard.Name);
                                    }
                                }
                            }
                        }
                    })
                    .catch((error) => console.error('Lỗi khi tải dữ liệu địa chỉ: ', error));
            } catch (error) {
                console.error('Token không hợp lệ: ', token);
            }
        } else {
            fetch('/address_data.json')
                .then((response) => response.json())
                .then((data) => {
                    setCities(data);
                })
                .catch((error) => console.error('Lỗi khi tải dữ liệu địa chỉ: ', error));
        }
    }, []);

    const handleUserInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target;

        if (name === 'name') {
            if (!value) {
                setUserErrors((prevErrors) => ({ ...prevErrors, name: 'Họ tên không được để trống.' }));
            } else {
                const vietnameseCharacterRegex =
                    /^[a-zA-ZàáãạảăắằẳẵặâấầẩẫậèéẹẻẽêềếểễệđìíĩỉịòóõọỏôốồổỗộơớờởỡợùúũụủưứừửữựỳỵỷỹýÀÁÃẠẢĂẮẰẲẴẶÂẤẦẨẪẬÈÉẸẺẼÊỀẾỂỄỆĐÌÍĨỈỊÒÓÕỌỎÔỐỒỔỖỘƠỚỜỞỠỢÙÚŨỤỦƯỨỪỬỮỰỲỴỶỸÝ\s]+$/;

                if (!vietnameseCharacterRegex.test(value)) {
                    setUserErrors((prevErrors) => ({
                        ...prevErrors,
                        name: 'Họ tên không được chứa số và ký tự đặc biệt.',
                    }));
                } else {
                    setUserErrors((prevErrors) => ({ ...prevErrors, name: undefined }));
                }
            }
        }

        if (name === 'phoneNumber') {
            if (!value) {
                setUserErrors((prevErrors) => ({ ...prevErrors, phoneNumber: 'Số điện thoại không được để trống.' }));
            } else {
                const phoneNumberRegex = /^0\d{9}$/;

                if (!phoneNumberRegex.test(value)) {
                    setUserErrors((prevErrors) => ({
                        ...prevErrors,
                        phoneNumber: 'Số điện thoại phải bắt đầu bằng số 0 và đủ 10 chữ số.',
                    }));
                } else {
                    setUserErrors((prevErrors) => ({ ...prevErrors, phoneNumber: undefined }));
                }
            }
        }

        if (name === 'email') {
            if (!value) {
                setUserErrors((prevErrors) => ({ ...prevErrors, email: 'Email không được để trống.' }));
            } else {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

                if (!emailRegex.test(value)) {
                    setUserErrors((prevErrors) => ({
                        ...prevErrors,
                        email: 'Email không hợp lệ.',
                    }));
                } else {
                    setUserErrors((prevErrors) => ({ ...prevErrors, email: undefined }));
                }
            }
        }

        setUserData({
            ...userData,
            [name]: value,
        });
    };

    const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];

        if (file) {
            if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
                setUserErrors((prevErrors) => ({
                    ...prevErrors,
                    avatar: 'Chỉ được chọn các tệp hình ảnh (jpg, jpeg, png, webp).',
                }));
                return;
            }

            if (file.size > MAX_FILE_SIZE) {
                setUserErrors((prevErrors) => ({
                    ...prevErrors,
                    avatar: 'Dung lượng ảnh phải nhỏ hơn 2MB.',
                }));
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result as string);
                setUserData({
                    ...userData,
                    avatar: file,
                });
                setUserErrors((prevErrors) => ({
                    ...prevErrors,
                    avatar: undefined,
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const updateAddress = (cityName: string, districtName: string, wardName: string) => {
        const address = `${wardName ? wardName + ', ' : ''}${districtName ? districtName + ', ' : ''}${cityName}`;

        setUserData({
            ...userData,
            address,
        });
    };

    const handleCityChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const cityId = event.target.value;
        const selectedCity = cities.find((city) => city.Id === cityId);

        if (!cityId) {
            setUserErrors((prevErrors) => ({ ...prevErrors, city: 'Vui lòng chọn Tỉnh/Thành phố.' }));
        } else {
            setUserErrors((prevErrors) => ({ ...prevErrors, city: undefined }));
        }

        if (selectedCity) {
            setDistricts(selectedCity.Districts);
            setWards([]);
            setSelectedCity(selectedCity.Name);
            setSelectedDistrict('');
            setSelectedWard('');
            updateAddress(selectedCity.Name, '', '');
        } else {
            setDistricts([]);
            setWards([]);
            setSelectedCity('');
            setSelectedDistrict('');
            setSelectedWard('');
            updateAddress('', '', '');
        }
    };

    const handleDistrictChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const districtId = event.target.value;
        const selectedDistrict = districts.find((district) => district.Id === districtId);

        if (!districtId) {
            setUserErrors((prevErrors) => ({ ...prevErrors, district: 'Vui lòng chọn Quận/Huyện.' }));
        } else {
            setUserErrors((prevErrors) => ({ ...prevErrors, district: undefined }));
        }

        if (selectedDistrict) {
            setWards(selectedDistrict.Wards);
            setSelectedDistrict(selectedDistrict.Name);
            setSelectedWard('');
            updateAddress(selectedCity, selectedDistrict.Name, '');
        } else {
            setWards([]);
            setSelectedDistrict('');
            setSelectedWard('');
            updateAddress(selectedCity, '', '');
        }
    };

    const handleWardChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const wardId = event.target.value;
        const selectedWard = wards.find((ward) => ward.Id === wardId);

        if (!wardId) {
            setUserErrors((prevErrors) => ({ ...prevErrors, ward: 'Vui lòng chọn Phường/Xã.' }));
        } else {
            setUserErrors((prevErrors) => ({ ...prevErrors, ward: undefined }));
        }

        if (selectedWard) {
            setSelectedWard(selectedWard.Name);
            updateAddress(selectedCity, selectedDistrict, selectedWard.Name);
        } else {
            setSelectedWard('');
            updateAddress(selectedCity, selectedDistrict, '');
        }
    };

    const handleUpdateAccount = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const newErrors: {
            name?: string;
            phoneNumber?: string;
            email?: string;
            city?: string;
            district?: string;
            ward?: string;
            avatar?: string;
        } = {};

        if (!userData.name) {
            newErrors.name = 'Họ tên không được để trống.';
        }

        if (!userData.phoneNumber) {
            newErrors.phoneNumber = 'Số điện thoại không được để trống.';
        }

        if (!userData.email) {
            newErrors.email = 'Email không được để trống.';
        }

        if (!selectedCity) {
            newErrors.city = 'Vui lòng chọn Tỉnh/Thành phố.';
        }

        if (!selectedDistrict) {
            newErrors.district = 'Vui lòng chọn Quận/Huyện.';
        }

        if (!selectedWard) {
            newErrors.ward = 'Vui lòng chọn Phường/Xã.';
        }

        if (userErrors.avatar) {
            newErrors.avatar = userErrors.avatar;
        }

        setUserErrors(newErrors);

        if (Object.values(newErrors).some((error) => error)) {
            return;
        }

        const formData = new FormData();
        formData.append('name', userData.name || '');
        formData.append('email', userData.email);
        formData.append('phoneNumber', userData.phoneNumber || '');
        formData.append('address', userData.address || '');
        if (userData.avatar) {
            formData.append('avatar', userData.avatar);
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

            if (axios.isAxiosError(error)) {
                if (error.response && error.response.status === 409) {
                    const apiErrors = error.response.data.messages;
                    const newApiErrors: {
                        phoneNumber?: string;
                        email?: string;
                    } = {};

                    apiErrors.forEach((errorMessage: string) => {
                        if (errorMessage.includes('PhoneNumber')) {
                            newApiErrors.phoneNumber = 'Số điện thoại đã tồn tại.';
                        } else if (errorMessage.includes('Email')) {
                            newApiErrors.email = 'Email đã tồn tại.';
                        }
                    });

                    setUserErrors(newApiErrors);
                }
            } else {
                Swal.fire({
                    title: 'Lỗi không xác định!',
                    icon: 'error',
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 3000,
                });
            }
        }
    };

    const handlePasswordInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target;

        if (name === 'currentPassword') {
            if (!value) {
                setPasswordErrors((prevErrors) => ({
                    ...prevErrors,
                    currentPassword: 'Mật khẩu cũ không được để trống.',
                }));
            } else {
                setPasswordErrors((prevErrors) => ({ ...prevErrors, currentPassword: undefined }));
            }
        }

        if (name === 'newPassword') {
            if (!value) {
                setPasswordErrors((prevErrors) => ({
                    ...prevErrors,
                    newPassword: 'Mật khẩu mới không được để trống.',
                }));
            } else {
                setPasswordErrors((prevErrors) => ({ ...prevErrors, newPassword: undefined }));
            }
        }

        if (name === 'confirmPassword') {
            if (!value) {
                setPasswordErrors((prevErrors) => ({
                    ...prevErrors,
                    confirmPassword: 'Xác nhận mật khẩu không được để trống.',
                }));
            } else {
                setPasswordErrors((prevErrors) => ({ ...prevErrors, confirmPassword: undefined }));
            }
        }

        setPasswordData({
            ...passwordData,
            [name]: value,
        });
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

        setPasswordErrors(newErrors);

        if (Object.values(newErrors).some((error) => error)) {
            return;
        }

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
            <div className="card card-outline" style={{ minHeight: '490px' }}>
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
                                <div className="row d-flex justify-content-center my-4">
                                    <div className="col-md-4">
                                        <div className="card-body box-profile text-center">
                                            <img
                                                src={avatarPreview}
                                                id="avatar-preview"
                                                className="profile-user-img img-fluid img-circle d-block"
                                                style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                                                alt="Ảnh đại diện"
                                            />
                                            {userErrors.avatar && (
                                                <div className="text-danger">{userErrors.avatar}</div>
                                            )}
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
                                                className="btn btn-gray my-3 font-weight-normal"
                                            >
                                                Chọn ảnh
                                            </label>
                                            <h3 className="profile-username">{userData.name || userData.userName}</h3>
                                            <p className="text-muted">{userData.role}</p>
                                        </div>
                                    </div>
                                    <div className="col-md-8">
                                        <input type="hidden" name="id" id="id" value="" />
                                        <div className="row my-6">
                                            <label htmlFor="username" className="col-md-3 mt-2">
                                                Tên đăng nhập:
                                            </label>
                                            <div className="col-md-6">
                                                <input
                                                    type="text"
                                                    id="username"
                                                    className="form-control"
                                                    value={userData.userName}
                                                    readOnly
                                                />
                                            </div>
                                        </div>
                                        <div className="row my-4">
                                            <label htmlFor="name" className="col-md-3 mt-2">
                                                Họ tên:
                                            </label>
                                            <div className="col-md-6">
                                                <input
                                                    type="text"
                                                    name="name"
                                                    id="name"
                                                    className="form-control"
                                                    value={userData.name}
                                                    onChange={handleUserInputChange}
                                                />
                                                {userErrors.name && (
                                                    <div className="text-danger">{userErrors.name}</div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="row my-4">
                                            <label htmlFor="phone-number" className="col-md-3 mt-2">
                                                Điện thoại:
                                            </label>
                                            <div className="col-md-6">
                                                <input
                                                    type="text"
                                                    name="phoneNumber"
                                                    id="phone-number"
                                                    className="form-control"
                                                    value={userData.phoneNumber}
                                                    onChange={handleUserInputChange}
                                                />
                                                {userErrors.phoneNumber && (
                                                    <div className="text-danger">{userErrors.phoneNumber}</div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="row my-4">
                                            <label htmlFor="email" className="col-md-3 mt-2">
                                                Email:
                                            </label>
                                            <div className="col-md-6">
                                                <input
                                                    type="text"
                                                    name="email"
                                                    id="email"
                                                    className="form-control"
                                                    value={userData.email}
                                                    onChange={handleUserInputChange}
                                                />
                                                {userErrors.email && (
                                                    <div className="text-danger">{userErrors.email}</div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="row my-4">
                                            <label htmlFor="city" className="col-md-3 mt-2">
                                                Tỉnh/Thành phố<sup>*</sup>
                                            </label>
                                            <div className="col-md-6">
                                                <select
                                                    id="city"
                                                    className="form-select"
                                                    value={cities.find((city) => city.Name === selectedCity)?.Id || ''}
                                                    onChange={handleCityChange}
                                                >
                                                    <option value="" disabled>
                                                        Chọn Tỉnh/Thành phố
                                                    </option>
                                                    {cities.map((city) => (
                                                        <option key={city.Id} value={city.Id}>
                                                            {city.Name}
                                                        </option>
                                                    ))}
                                                </select>
                                                {userErrors.city && (
                                                    <div className="text-danger">{userErrors.city}</div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="row my-4">
                                            <label htmlFor="district" className="col-md-3 mt-2">
                                                Quận/Huyện<sup>*</sup>
                                            </label>
                                            <div className="col-md-6">
                                                <select
                                                    id="district"
                                                    className="form-select"
                                                    value={
                                                        districts.find((district) => district.Name === selectedDistrict)
                                                            ?.Id || ''
                                                    }
                                                    onChange={handleDistrictChange}
                                                    disabled={districts.length === 0}
                                                >
                                                    <option value="" disabled>
                                                        Chọn Quận/Huyện
                                                    </option>
                                                    {districts.map((district) => (
                                                        <option key={district.Id} value={district.Id}>
                                                            {district.Name}
                                                        </option>
                                                    ))}
                                                </select>
                                                {userErrors.district && (
                                                    <div className="text-danger">{userErrors.district}</div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="row my-4">
                                            <label htmlFor="ward" className="col-md-3 mt-2">
                                                Phường/Xã<sup>*</sup>
                                            </label>
                                            <div className="col-md-6">
                                                <select
                                                    id="ward"
                                                    className="form-select"
                                                    value={wards.find((ward) => ward.Name === selectedWard)?.Id || ''}
                                                    onChange={handleWardChange}
                                                    disabled={wards.length === 0}
                                                >
                                                    <option value="" disabled>
                                                        Chọn Phường/Xã
                                                    </option>
                                                    {wards.map((ward) => (
                                                        <option key={ward.Id} value={ward.Id}>
                                                            {ward.Name}
                                                        </option>
                                                    ))}
                                                </select>
                                                {userErrors.ward && (
                                                    <div className="text-danger">{userErrors.ward}</div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="row my-2">
                                            <label htmlFor="address" className="col-md-3 mt-2">
                                                Địa chỉ:
                                            </label>
                                            <div className="col-md-6">
                                                <textarea
                                                    name="address"
                                                    id="address"
                                                    className="form-control"
                                                    value={userData.address}
                                                    disabled
                                                ></textarea>
                                            </div>
                                        </div>
                                        <div className="text-center">
                                            <button type="submit" className="btn btn-blue mt-3">
                                                <i className="fas fa-check-circle"></i> Cập nhật
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
                                        Mật khẩu cũ:
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
                                        {passwordErrors.currentPassword && (
                                            <div className="text-danger">{passwordErrors.currentPassword}</div>
                                        )}
                                    </div>
                                </div>
                                <div className="row d-flex justify-content-center my-4">
                                    <label htmlFor="new-password" className="col-md-2 mt-2">
                                        Mật khẩu mới:
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
                                        {passwordErrors.newPassword && (
                                            <div className="text-danger">{passwordErrors.newPassword}</div>
                                        )}
                                    </div>
                                </div>
                                <div className="row d-flex justify-content-center my-2">
                                    <label htmlFor="confirm-password" className="col-md-2">
                                        Xác nhận mật khẩu:
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
                                        {passwordErrors.confirmPassword && (
                                            <div className="text-danger">{passwordErrors.confirmPassword}</div>
                                        )}
                                    </div>
                                </div>
                                <div className="row d-flex justify-content-center">
                                    <div id="alert-message" className="col-md-7">
                                        {error && (
                                            <div className="alert alert-danger mt-3" role="alert">
                                                {error}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="custom-control custom-checkbox text-center my-2">
                                    <input
                                        type="checkbox"
                                        id="show-password"
                                        className="custom-control-input"
                                        onChange={() => setShowPassword(!showPassword)}
                                    />
                                    <label htmlFor="show-password" className="custom-control-label">
                                        Hiện mật khẩu
                                    </label>
                                </div>
                                <div className="text-center">
                                    <button type="submit" className="btn btn-blue mt-3">
                                        <i className="fas fa-check-circle"></i> Lưu
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
