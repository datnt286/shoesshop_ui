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
        email: '',
        phoneNumber: '',
        address: '',
        avatar: null,
    });
    const [avatarPreview, setAvatarPreview] = useState(DefaultAvatar);

    const [cities, setCities] = useState<City[]>([]);
    const [districts, setDistricts] = useState<District[]>([]);
    const [wards, setWards] = useState<Ward[]>([]);
    const [selectedCity, setSelectedCity] = useState<string>('');
    const [selectedDistrict, setSelectedDistrict] = useState<string>('');
    const [selectedWard, setSelectedWard] = useState<string>('');

    const [errors, setErrors] = useState<{
        name?: string;
        phoneNumber?: string;
        email?: string;
        city?: string;
        district?: string;
        ward?: string;
        avatar?: string;
    }>({});

    useEffect(() => {
        const token = localStorage.getItem('customerToken');

        if (token) {
            try {
                const decodedToken: User = jwtDecode<User>(token);

                setToken(token);
                setUserData({
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

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target;

        if (name === 'name') {
            if (!value) {
                setErrors((prevErrors) => ({ ...prevErrors, name: 'Họ tên không được để trống.' }));
            } else {
                const vietnameseCharacterRegex =
                    /^[a-zA-ZàáãạảăắằẳẵặâấầẩẫậèéẹẻẽêềếểễệđìíĩỉịòóõọỏôốồổỗộơớờởỡợùúũụủưứừửữựỳỵỷỹýÀÁÃẠẢĂẮẰẲẴẶÂẤẦẨẪẬÈÉẸẺẼÊỀẾỂỄỆĐÌÍĨỈỊÒÓÕỌỎÔỐỒỔỖỘƠỚỜỞỠỢÙÚŨỤỦƯỨỪỬỮỰỲỴỶỸÝ\s]+$/;

                if (!vietnameseCharacterRegex.test(value)) {
                    setErrors((prevErrors) => ({
                        ...prevErrors,
                        name: 'Họ tên không được chứa số và ký tự đặc biệt.',
                    }));
                } else {
                    setErrors((prevErrors) => ({ ...prevErrors, name: undefined }));
                }
            }
        }

        if (name === 'phoneNumber') {
            if (!value) {
                setErrors((prevErrors) => ({ ...prevErrors, phoneNumber: 'Số điện thoại không được để trống.' }));
            } else {
                const phoneNumberRegex = /^0\d{9}$/;

                if (!phoneNumberRegex.test(value)) {
                    setErrors((prevErrors) => ({
                        ...prevErrors,
                        phoneNumber: 'Số điện thoại phải bắt đầu bằng số 0 và đủ 10 chữ số.',
                    }));
                } else {
                    setErrors((prevErrors) => ({ ...prevErrors, phoneNumber: undefined }));
                }
            }
        }

        if (name === 'email') {
            if (!value) {
                setErrors((prevErrors) => ({ ...prevErrors, email: 'Email không được để trống.' }));
            } else {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

                if (!emailRegex.test(value)) {
                    setErrors((prevErrors) => ({
                        ...prevErrors,
                        email: 'Email không hợp lệ.',
                    }));
                } else {
                    setErrors((prevErrors) => ({ ...prevErrors, email: undefined }));
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
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    avatar: 'Chỉ được chọn các tệp hình ảnh (jpg, jpeg, png, webp).',
                }));
                return;
            }

            if (file.size > MAX_FILE_SIZE) {
                setErrors((prevErrors) => ({
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
                setErrors((prevErrors) => ({
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
            setErrors((prevErrors) => ({ ...prevErrors, city: 'Vui lòng chọn Tỉnh/Thành phố.' }));
        } else {
            setErrors((prevErrors) => ({ ...prevErrors, city: undefined }));
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
            setErrors((prevErrors) => ({ ...prevErrors, district: 'Vui lòng chọn Quận/Huyện.' }));
        } else {
            setErrors((prevErrors) => ({ ...prevErrors, district: undefined }));
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
            setErrors((prevErrors) => ({ ...prevErrors, ward: 'Vui lòng chọn Phường/Xã.' }));
        } else {
            setErrors((prevErrors) => ({ ...prevErrors, ward: undefined }));
        }

        if (selectedWard) {
            setSelectedWard(selectedWard.Name);
            updateAddress(selectedCity, selectedDistrict, selectedWard.Name);
        } else {
            setSelectedWard('');
            updateAddress(selectedCity, selectedDistrict, '');
        }
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
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

        if (errors.avatar) {
            newErrors.avatar = errors.avatar;
        }

        setErrors(newErrors);

        if (Object.values(newErrors).some((error) => error)) {
            return;
        }

        const formData = new FormData();
        formData.append('userName', userData.userName);
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
                localStorage.setItem('customerToken', response.data.token);

                Swal.fire({
                    title: 'Cập nhật thông tin tài khoản thành công!',
                    icon: 'success',
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#3085d6',
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

                    setErrors(newApiErrors);
                }
            } else {
                Swal.fire({
                    title: 'Cập nhật thông tin tài khoản thất bại! Vui lòng thử lại.',
                    icon: 'error',
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#3085d6',
                });
            }
        }
    };

    return (
        <div className="container-fluid py-5">
            <div className="container py-5">
                <form onSubmit={handleSubmit} encType="multipart/form-data">
                    <div className="row">
                        <div className="col-md-12 col-lg-8 col-xl-8 offset-lg-2 offset-xl-2">
                            <div className="border border-1 rounded p-5">
                                <div className="row">
                                    <div className="col-md-12 col-lg-4 col-xl-4">
                                        <div className="text-center">
                                            <div className="row">
                                                <div className="col-12">
                                                    <img
                                                        src={avatarPreview}
                                                        className="img-fluid rounded-circle"
                                                        style={{ width: '100px', height: '100px' }}
                                                        alt="Ảnh đại diện"
                                                    />
                                                    {errors.avatar && (
                                                        <div className="text-danger">{errors.avatar}</div>
                                                    )}
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
                                                value={userData.userName}
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
                                                value={userData.name}
                                                onChange={handleInputChange}
                                            />
                                            {errors.name && <div className="text-danger">{errors.name}</div>}
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
                                                value={userData.email}
                                                onChange={handleInputChange}
                                            />
                                            {errors.email && <div className="text-danger">{errors.email}</div>}
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
                                                value={userData.phoneNumber}
                                                onChange={handleInputChange}
                                            />
                                            {errors.phoneNumber && (
                                                <div className="text-danger">{errors.phoneNumber}</div>
                                            )}
                                        </div>
                                        <div className="form-item">
                                            <label htmlFor="city" className="form-label my-3">
                                                Tỉnh/Thành phố<sup>*</sup>
                                            </label>
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
                                            {errors.city && <div className="text-danger">{errors.city}</div>}
                                        </div>
                                        <div className="form-item">
                                            <label htmlFor="district" className="form-label my-3">
                                                Quận/Huyện<sup>*</sup>
                                            </label>
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
                                            {errors.district && <div className="text-danger">{errors.district}</div>}
                                        </div>
                                        <div className="form-item">
                                            <label htmlFor="ward" className="form-label my-3">
                                                Phường/Xã<sup>*</sup>
                                            </label>
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
                                            {errors.ward && <div className="text-danger">{errors.ward}</div>}
                                        </div>
                                        <div className="form-item">
                                            <label htmlFor="address" className="form-label my-3">
                                                Địa chỉ<sup>*</sup>
                                            </label>
                                            <textarea
                                                name="address"
                                                id="address"
                                                className="form-control"
                                                value={userData.address}
                                                disabled
                                            ></textarea>
                                        </div>
                                    </div>
                                </div>
                                <div className="d-flex justify-content-center mt-5">
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
