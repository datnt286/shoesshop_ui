import React, { useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import Swal from 'sweetalert2';
import AxiosInstance from '../../../services/AxiosInstance';
import config from '../../../services/config';
import Pagination from '../Pagination/index';
import ExportExcelButton from './../ExportExcelButton/index';
import DefaultAvatar from '../../resources/img/default-avatar.jpg';

const ALLOWED_IMAGE_TYPES = ['image/jpg', 'image/jpeg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE = 2 * 1024 * 1024;

interface Customer {
    id: string | null;
    userName: string;
    password: string;
    name: string;
    phoneNumber: string;
    email: string;
    address: string;
    description: string;
    status: number;
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

const Customer: React.FC = () => {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [customerData, setCustomerData] = useState<Customer>({
        id: null,
        userName: '',
        password: '',
        name: '',
        phoneNumber: '',
        email: '',
        address: '',
        description: '',
        status: 1,
        avatar: null,
    });
    const [avatarPreview, setAvatarPreview] = useState(DefaultAvatar);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [keyword, setKeyword] = useState('');

    const [cities, setCities] = useState<City[]>([]);
    const [districts, setDistricts] = useState<District[]>([]);
    const [wards, setWards] = useState<Ward[]>([]);
    const [selectedCity, setSelectedCity] = useState<string>('');
    const [selectedDistrict, setSelectedDistrict] = useState<string>('');
    const [selectedWard, setSelectedWard] = useState<string>('');

    const [errors, setErrors] = useState<{
        password?: string;
        name?: string;
        phoneNumber?: string;
        email?: string;
        city?: string;
        district?: string;
        ward?: string;
        avatar?: string;
    }>({});

    const avatarSrc = selectedCustomer?.avatar
        ? `${config.baseURL}/images/avatar/${selectedCustomer.avatar}`
        : DefaultAvatar;

    const fetchCustomers = async (currentPage = 1, pageSize = 10) => {
        try {
            const params: any = {
                currentPage,
                pageSize,
            };

            if (keyword) {
                params.keyword = keyword;
            }

            const response = await AxiosInstance.get('/Users/Customers/paged', {
                params,
            });

            if (response.status === 200) {
                setCustomers(response.data.items);
                setTotalPages(response.data.totalPages);
            }
        } catch (error) {
            console.error('Lỗi khi tải dữ liệu: ', error);

            Swal.fire({
                title: 'Lỗi khi tải dữ liệu!',
                icon: 'error',
                toast: true,
                position: 'top-end',
                timerProgressBar: true,
                showConfirmButton: false,
                timer: 3000,
            });
        }
    };

    useEffect(() => {
        fetchCustomers();
    }, []);

    useEffect(() => {
        fetch('/address_data.json')
            .then((response) => response.json())
            .then((data) => {
                setCities(data);
            })
            .catch((error) => console.error('Lỗi khi tải dữ liệu địa chỉ: ', error));
    }, []);

    const handlePageChange = ({ selected }: { selected: number }) => {
        const currentPage = selected + 1;
        fetchCustomers(currentPage);
    };

    const handleEditClick = (customer: Customer) => {
        setSelectedCustomer(customer);
        setModalTitle('Cập nhật khách hàng');
        setShowModal(true);
        setCustomerData({
            ...customerData,
            id: customer.id,
            userName: customer.userName,
            password: customer.password,
            name: customer.name,
            phoneNumber: customer.phoneNumber,
            email: customer.email,
            address: customer.address,
            description: customer.description,
            status: customer.status,
        });

        const avatarSrc = customer.avatar ? `${config.baseURL}/images/avatar/${customer.avatar}` : DefaultAvatar;
        setAvatarPreview(avatarSrc);

        const addressParts = (customer.address || '').split(',').map((part) => part.trim());
        const wardName = addressParts[0];
        const districtName = addressParts[1];
        const cityName = addressParts[2];

        const selectedCity = cities.find((city) => city.Name === cityName);
        if (selectedCity) {
            setDistricts(selectedCity.Districts);
            setSelectedCity(selectedCity.Name);

            const selectedDistrict = selectedCity.Districts.find((district) => district.Name === districtName);
            if (selectedDistrict) {
                setWards(selectedDistrict.Wards);
                setSelectedDistrict(selectedDistrict.Name);

                const selectedWard = selectedDistrict.Wards.find((ward) => ward.Name === wardName);
                if (selectedWard) {
                    setSelectedWard(selectedWard.Name);
                } else {
                    setSelectedWard('');
                }
            } else {
                setSelectedDistrict('');
                setWards([]);
                setSelectedWard('');
            }
        } else {
            setSelectedCity('');
            setDistricts([]);
            setWards([]);
            setSelectedDistrict('');
            setSelectedWard('');
        }
    };

    const handleClose = () => {
        setShowModal(false);
        setSelectedCustomer(null);
        resetFormData();
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;

        if (name === 'password') {
            if (value) {
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
            } else {
                setErrors((prevErrors) => ({ ...prevErrors, password: undefined }));
            }
        }

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

        setCustomerData({
            ...customerData,
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
                setCustomerData({
                    ...customerData,
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

        setCustomerData({
            ...customerData,
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
        } = { ...errors };

        if (!customerData.name) {
            newErrors.name = 'Họ tên không được để trống.';
        }

        if (!customerData.phoneNumber) {
            newErrors.phoneNumber = 'Số điện thoại không được để trống.';
        }

        if (!customerData.email) {
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

        try {
            let formData = new FormData();
            formData.append('id', customerData.id ?? '');
            formData.append('userName', customerData.userName);
            formData.append('password', customerData.password);
            formData.append('name', customerData.name);
            formData.append('phoneNumber', customerData.phoneNumber);
            formData.append('email', customerData.email);
            formData.append('address', customerData.address);
            formData.append('description', customerData.description);
            formData.append('status', customerData.status.toString());
            if (customerData.avatar) {
                formData.append('avatar', customerData.avatar);
            }

            if (selectedCustomer) {
                const response = await AxiosInstance.put(`/Users/Customers/${selectedCustomer.id}`, formData);

                if (response.status === 200) {
                    Swal.fire({
                        title: 'Cập nhật khách hàng thành công!',
                        icon: 'success',
                        toast: true,
                        position: 'top-end',
                        timerProgressBar: true,
                        showConfirmButton: false,
                        timer: 1000,
                    });
                }
            }

            fetchCustomers();
            resetFormData();
            handleClose();
        } catch (error) {
            console.error('Lỗi khi gửi dữ liệu:', error);

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
                    title: 'Lỗi không xác định!',
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

    const resetFormData = () => {
        setCustomerData({
            id: null,
            userName: '',
            password: '',
            name: '',
            phoneNumber: '',
            email: '',
            address: '',
            description: '',
            status: 1,
            avatar: null,
        });
        setShowPassword(false);
        setErrors({});
    };

    const handleDetailClick = (customer: Customer) => {
        setSelectedCustomer(customer);
        setShowDetailModal(true);
    };

    const handleCloseDetailModal = () => setShowDetailModal(false);

    const handleSearchInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setKeyword(event.target.value);
    };

    const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        fetchCustomers();
    };

    return (
        <>
            <div className="row my-4">
                <div className="col-9">
                    <h1 className="m-0">Quản lý khách hàng</h1>
                </div>
            </div>

            <div className="card">
                <div className="card-header">
                    <ExportExcelButton endpoint="/Users/Customers" filename="khach-hang" />
                    <form className="float-right d-flex justify-content-center" onSubmit={handleSearchSubmit}>
                        <input
                            type="search"
                            className="form-control form-control-sm"
                            onChange={handleSearchInputChange}
                        />
                        <button type="submit" className="btn btn-gray btn-sm text-nowrap ml-2">
                            <i className="fas fa-search"></i>
                        </button>
                    </form>
                </div>
                <div className="card-body">
                    <table className="table table-bordered table-striped">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Ảnh đại diện</th>
                                <th>Tên đăng nhập</th>
                                <th>Họ tên</th>
                                <th>Điện thoại</th>
                                <th>Email</th>
                                <th>Trạng thái</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {customers.length > 0 ? (
                                customers.map((customer, index) => {
                                    const avatarSrc = customer.avatar
                                        ? `${config.baseURL}/images/avatar/${customer.avatar}`
                                        : DefaultAvatar;

                                    return (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>
                                                <img
                                                    src={avatarSrc}
                                                    className="img-thumbnail cursor-pointer"
                                                    width={50}
                                                    height={50}
                                                    onClick={() => handleDetailClick(customer)}
                                                    alt="Avatar"
                                                />
                                            </td>
                                            <td>
                                                <span
                                                    className="cursor-pointer underline-on-hover"
                                                    onClick={() => handleDetailClick(customer)}
                                                >
                                                    {customer.userName}
                                                </span>
                                            </td>
                                            <td>
                                                <span
                                                    className="cursor-pointer underline-on-hover"
                                                    onClick={() => handleDetailClick(customer)}
                                                >
                                                    {customer.name}
                                                </span>
                                            </td>
                                            <td>{customer.phoneNumber}</td>
                                            <td>{customer.email}</td>
                                            <td>{customer.status === 1 ? 'Hoạt động' : 'Bị khoá'}</td>
                                            <td>
                                                <div className="project-actions text-right">
                                                    {/* <button
                                                        className="btn btn-gray btn-sm mr-2"
                                                        onClick={() => handleDetailClick(customer)}
                                                    >
                                                        <i className="fas fa-info-circle"></i>
                                                    </button> */}
                                                    <button
                                                        className="btn btn-blue btn-sm mr-2"
                                                        onClick={() => handleEditClick(customer)}
                                                    >
                                                        <i className="fas fa-edit"></i>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <h3 className="m-2">Danh sách khách hàng trống.</h3>
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="card-footer clearfix">
                    <Pagination totalPages={totalPages} onPageChange={handlePageChange} />
                </div>
            </div>

            <Modal show={showModal} onHide={handleClose}>
                <form onSubmit={handleSubmit} encType="multipart/form-data">
                    <Modal.Header>
                        <Modal.Title>{modalTitle}</Modal.Title>
                        <Button variant="light" className="close" onClick={handleClose} aria-label="Close">
                            <span>&times;</span>
                        </Button>
                    </Modal.Header>
                    <Modal.Body>
                        <input type="hidden" name="id" id="id" value={customerData.id || ''} />
                        <div className="form-group text-center">
                            <label htmlFor="avatar" className="form-label d-block">
                                Ảnh đại diện:
                            </label>
                            <div>
                                <img
                                    src={avatarPreview}
                                    className="img img-thumbnail my-2"
                                    style={{ maxWidth: '100px', maxHeight: '100px' }}
                                    alt="Ảnh đại diện"
                                />
                                {errors.avatar && <div className="text-danger">{errors.avatar}</div>}
                            </div>
                            <input
                                type="file"
                                name="avatar"
                                id="avatar"
                                className="d-none"
                                onChange={handleAvatarChange}
                            />
                            <label htmlFor="avatar" className="btn btn-gray font-weight-normal mt-2">
                                Chọn ảnh
                            </label>
                        </div>
                        <div className="form-group">
                            <label htmlFor="username">Tên đăng nhập: </label>
                            <input
                                type="text"
                                name="userName"
                                id="username"
                                className="form-control"
                                value={customerData.userName}
                                readOnly
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Mật khẩu: </label>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                id="password"
                                className="form-control"
                                value={customerData.password}
                                onChange={handleInputChange}
                            />
                            {errors.password && <div className="text-danger">{errors.password}</div>}
                        </div>
                        <div className="custom-control custom-checkbox text-center">
                            <input
                                type="checkbox"
                                id="show-password"
                                className="custom-control-input"
                                onChange={() => setShowPassword(!showPassword)}
                            />
                            <label htmlFor="show-password" className="custom-control-label">
                                {' '}
                                Hiện mật khẩu
                            </label>
                        </div>
                        <div className="form-group">
                            <label htmlFor="name">Họ tên: </label>
                            <input
                                type="text"
                                name="name"
                                id="name"
                                className="form-control"
                                value={customerData.name}
                                onChange={handleInputChange}
                            />
                            {errors.name && <div className="text-danger">{errors.name}</div>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="phone-number">Điện thoại: </label>
                            <input
                                type="tel"
                                name="phoneNumber"
                                id="phone-number"
                                className="form-control"
                                value={customerData.phoneNumber}
                                onChange={handleInputChange}
                            />
                            {errors.phoneNumber && <div className="text-danger">{errors.phoneNumber}</div>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">Email: </label>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                className="form-control"
                                value={customerData.email}
                                onChange={handleInputChange}
                            />
                            {errors.email && <div className="text-danger">{errors.email}</div>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="city">Tỉnh/Thành phố</label>
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
                        <div className="form-group">
                            <label htmlFor="district">Quận/Huyện</label>
                            <select
                                id="district"
                                className="form-select"
                                value={districts.find((district) => district.Name === selectedDistrict)?.Id || ''}
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
                        <div className="form-group">
                            <label htmlFor="ward">Phường/Xã</label>
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
                        <div className="form-group">
                            <label htmlFor="address">Địa chỉ: </label>
                            <input
                                type="text"
                                name="address"
                                id="address"
                                className="form-control"
                                value={customerData.address}
                                disabled
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="description">Mô tả: </label>
                            <input
                                type="text"
                                name="description"
                                id="description"
                                className="form-control"
                                value={customerData.description}
                                onChange={handleInputChange}
                            />
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="gray" onClick={handleClose}>
                            <i className="fas fa-times-circle"></i> Huỷ
                        </Button>
                        <Button type="submit" variant="blue">
                            <i className="fas fa-check-circle"></i> Lưu
                        </Button>
                    </Modal.Footer>
                </form>
            </Modal>

            <Modal show={showDetailModal} onHide={handleCloseDetailModal}>
                <Modal.Header>
                    <Modal.Title>Chi tiết khách hàng</Modal.Title>
                    <Button variant="light" className="close" aria-label="Close" onClick={handleCloseDetailModal}>
                        <span>&times;</span>
                    </Button>
                </Modal.Header>
                <Modal.Body>
                    {selectedCustomer && (
                        <>
                            <div className="text-center">
                                <div className="form-group">
                                    <span className="text-lg font-weight-bold">Ảnh đại diện:</span>
                                </div>
                                <div className="form-group">
                                    <img
                                        src={avatarSrc}
                                        className="img img-thumbnail mb-3"
                                        style={{ maxWidth: '100px', maxHeight: '100px' }}
                                        alt="Ảnh đại diện"
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <span className="text-lg font-weight-bold">Tên đăng nhập: </span>
                                <span className="text-lg">{selectedCustomer.userName}</span>
                            </div>
                            <div className="form-group">
                                <span className="text-lg font-weight-bold">Họ tên: </span>
                                <span className="text-lg">{selectedCustomer.name}</span>
                            </div>
                            <div className="form-group">
                                <span className="text-lg font-weight-bold">Điện thoại: </span>
                                <span className="text-lg">{selectedCustomer.phoneNumber}</span>
                            </div>
                            <div className="form-group">
                                <span className="text-lg font-weight-bold">Email: </span>
                                <span className="text-lg">{selectedCustomer.email}</span>
                            </div>
                            <div className="form-group">
                                <span className="text-lg font-weight-bold">Địa chỉ: </span>
                                <span className="text-lg">{selectedCustomer.address}</span>
                            </div>
                            <div className="form-group">
                                <span className="text-lg font-weight-bold">Mô tả: </span>
                                <span className="text-lg">{selectedCustomer.description}</span>
                            </div>
                            <div className="form-group">
                                <span className="text-lg font-weight-bold">Trạng thái: </span>
                                <span className="text-lg">
                                    {selectedCustomer.status === 1 ? 'Còn hoạt động' : 'Không hoạt động'}
                                </span>
                            </div>
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="light" onClick={handleCloseDetailModal}>
                        <i className="fas fa-times-circle"></i> Đóng
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default Customer;
