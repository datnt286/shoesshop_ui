import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import Swal from 'sweetalert2';
import axios from 'axios';
import AxiosInstance from '../../../services/AxiosInstance';
import TableRow from './TableRow';
import VNPayImg from './../../resources/img/vn-pay.jpg';
import MomoImg from './../../resources/img/momo.png';

interface User {
    id: string;
    userName: string;
    name?: string;
    email: string;
    phoneNumber?: string;
    address?: string;
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

interface CartDetail {
    id: number;
    modelId: number;
    productId: number;
    productName: string;
    productImage: string;
    price: number;
    quantity: number;
    quantityAvailable: number;
    amount: number;
}

const Checkout: React.FC = () => {
    const [token, setToken] = useState<string | null>(null);
    const [userData, setUserData] = useState<User>({
        id: '',
        userName: '',
        name: '',
        email: '',
        phoneNumber: '',
        address: '',
    });
    const [cartDetails, setCartDetails] = useState<CartDetail[]>([]);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('VN Pay');
    const [total, setTotal] = useState(0);
    const [note, setNote] = useState('');
    const [canProceedToCheckout, setCanProceedToCheckout] = useState(false);

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
    }>({});

    const navigate = useNavigate();

    const fetchCartDetails = async () => {
        try {
            const response = await AxiosInstance.get('/Carts/CartDetails/User', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.status === 200) {
                setCartDetails(response.data);
            }
        } catch (error) {
            console.error('Lỗi khi tải dữ liệu: ', error);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('customerToken');

        if (token) {
            try {
                const decodedToken: User = jwtDecode<User>(token);

                setToken(token);
                setUserData({
                    id: decodedToken.id,
                    userName: decodedToken.userName,
                    name: decodedToken.name || '',
                    email: decodedToken.email || '',
                    phoneNumber: decodedToken.phoneNumber || '',
                    address: decodedToken.address || '',
                });

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

    useEffect(() => {
        if (token) {
            fetchCartDetails();
        }
    }, [token]);

    useEffect(() => {
        const total = cartDetails.reduce((acc, item) => acc + item.amount, 0);
        setTotal(total);

        const hasError = cartDetails.some((detail) => detail.quantity > detail.quantityAvailable);
        setCanProceedToCheckout(!hasError);
    }, [cartDetails]);

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

    const updateAccount = async () => {
        const newErrors: {
            name?: string;
            phoneNumber?: string;
            email?: string;
            city?: string;
            district?: string;
            ward?: string;
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

        setErrors(newErrors);

        if (Object.values(newErrors).some((error) => error)) {
            return false;
        }

        const formData = new FormData();
        formData.append('userName', userData.userName);
        formData.append('name', userData.name || '');
        formData.append('email', userData.email);
        formData.append('phoneNumber', userData.phoneNumber || '');
        formData.append('address', userData.address || '');

        try {
            const response = await AxiosInstance.put(`/Users/UpdateAccount`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.data.token) {
                localStorage.setItem('customerToken', response.data.token);
                return true;
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
            }
            return false;
        }
    };

    const handleUpdateAccount = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const accountUpdated = await updateAccount();

        if (accountUpdated) {
            Swal.fire({
                title: 'Cập nhật thông tin tài khoản thành công!',
                icon: 'success',
                confirmButtonText: 'OK',
                confirmButtonColor: '#3085d6',
            });
        }
    };

    const handleMoMoPayment = async () => {
        try {
            const response = await AxiosInstance.post(
                '/Payment',
                { requiredAmount: total + 15000 },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                },
            );

            if (response.status === 200) {
                const paymentResponse = response.data;
                // Assuming paymentResponse contains the redirect URL to MoMo
                window.location.href = paymentResponse.payUrl;
            } else {
                console.error('Payment creation failed:', response.status);
            }
        } catch (error) {
            console.error('Error during MoMo payment request:', error);
        }
    };

    const handlePostOrder = async () => {
        const accountUpdated = await updateAccount();

        if (!accountUpdated) {
            return;
        }

        fetchCartDetails();

        try {
            const data = {
                paymentMethod: selectedPaymentMethod,
                total: total,
                note: note,
                cartDetails: cartDetails.map((cartDetail) => ({
                    productId: cartDetail.productId,
                    price: cartDetail.price,
                    quantity: cartDetail.quantity,
                    amount: cartDetail.amount,
                })),
            };

            const response = await AxiosInstance.post('/Invoices', data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.status === 200) {
                navigate('/hoa-don');

                Swal.fire({
                    title: 'Đặt hàng thành công!',
                    icon: 'success',
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#3085d6',
                });
            }
        } catch (error) {
            console.error('Lỗi khi đặt hàng: ', error);

            if (axios.isAxiosError(error)) {
                if (error.response && error.response.status === 400) {
                    const apiError = error.response.data;

                    if (apiError === 'Product not available or insufficient quantity.') {
                        Swal.fire({
                            title: 'Số lượng sản phẩm không đủ! Vui lòng thử lại.',
                            icon: 'error',
                            confirmButtonText: 'OK',
                            confirmButtonColor: '#3085d6',
                        });
                    }
                }
            } else {
                Swal.fire({
                    title: 'Đặt hàng thất bại! Vui lòng thử lại.',
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
                <h1 className="mb-4">Chi tiết đơn hàng</h1>
                <div className="row g-5">
                    <div className="col-md-12 col-lg-5 col-xl-5">
                        <form onSubmit={handleUpdateAccount}>
                            <div className="form-item">
                                <label htmlFor="name" className="form-label my-3">
                                    Họ tên<sup>*</sup>
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    id="name"
                                    className="form-control"
                                    value={userData.name}
                                    onChange={handleInputChange}
                                />
                                {errors.name && <div className="text-danger">{errors.name}</div>}
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
                                {errors.phoneNumber && <div className="text-danger">{errors.phoneNumber}</div>}
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
                            <div className="d-flex justify-content-end">
                                <button
                                    type="submit"
                                    className="btn border-secondary py-2 mt-4 mb-2 rounded-pill text-uppercase w-25 text-primary"
                                >
                                    Lưu
                                </button>
                            </div>
                        </form>
                        <hr />
                        <div className="form-check my-3">
                            <input type="checkbox" id="other-address" className="form-check-input" />
                            <label htmlFor="other-address" className="form-check-label">
                                Giao tới một địa chỉ khác?
                            </label>
                        </div>
                        <div className="form-item">
                            <textarea
                                name="note"
                                className="form-control"
                                cols={30}
                                rows={10}
                                placeholder="Ghi chú (có thể bỏ trống)"
                                onChange={(e) => setNote(e.target.value)}
                            ></textarea>
                        </div>
                    </div>
                    <div className="col-md-12 col-lg-7 col-xl-7">
                        <div className="table-responsive">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th scope="col">Sản phẩm</th>
                                        <th scope="col">Tên</th>
                                        <th scope="col">Giá</th>
                                        <th scope="col">Số lượng</th>
                                        <th scope="col">Tổng cộng</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {cartDetails.map((cartDetail) => (
                                        <TableRow key={cartDetail.id} cartDetail={cartDetail} />
                                    ))}
                                    <tr>
                                        <th scope="row"></th>
                                        <td className="py-5" colSpan={2}>
                                            <p className="mb-0 text-dark py-3">Thành tiền</p>
                                        </td>
                                        <td className="py-5" colSpan={2}>
                                            <div className="py-3 border-bottom border-top text-center">
                                                <p className="mb-0 text-dark">{total.toLocaleString() + ' ₫'}</p>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th scope="row"></th>
                                        <td className="py-5" colSpan={2}>
                                            <p className="mb-0 text-dark py-3">Phí vận chuyển</p>
                                        </td>
                                        <td className="py-5" colSpan={2}>
                                            <div className="py-3 border-bottom border-top text-center">
                                                <p className="mb-0 text-dark">
                                                    Phí cố định: {(15000).toLocaleString() + ' ₫'}
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th scope="row"></th>
                                        <td className="py-5" colSpan={2}>
                                            <p className="mb-0 text-dark text-uppercase py-3">Tổng thành tiền</p>
                                        </td>
                                        <td className="py-5" colSpan={2}>
                                            <div className="py-3 border-bottom border-top text-center">
                                                <p className="mb-0 text-dark">
                                                    {(total + 15000).toLocaleString() + ' ₫'}
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="row g-4 align-items-center border-bottom py-3">
                            <div className="col-xl-3 col-12">
                                <div className="form-check text-start my-3">
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        id="vn-pay"
                                        className="form-check-input"
                                        value="VN Pay"
                                        onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                                        checked={selectedPaymentMethod === 'VN Pay'}
                                    />
                                    <img src={VNPayImg} style={{ width: '30px' }} alt="VN Pay" />
                                    <label className="form-check-label ml-2" htmlFor="vn-pay">
                                        VN Pay
                                    </label>
                                </div>
                            </div>
                            <div className="col-xl-3 col-12">
                                <div className="form-check text-start my-3">
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        id="momo"
                                        className="form-check-input"
                                        value="Momo"
                                        onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                                        checked={selectedPaymentMethod === 'Momo'}
                                    />
                                    <img src={MomoImg} style={{ width: '30px' }} alt="Momo" />
                                    <label className="form-check-label ml-2" htmlFor="momo">
                                        Momo
                                    </label>
                                </div>
                            </div>
                            <div className="col-xl-6 col-12">
                                <div className="form-check text-start my-3">
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        id="cod"
                                        className="form-check-input"
                                        value="COD"
                                        onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                                        checked={selectedPaymentMethod === 'COD'}
                                    />
                                    <i className="fas fa-truck-moving text-primary" style={{ fontSize: '18px' }}></i>
                                    <label className="form-check-label ml-2" htmlFor="cod">
                                        Thanh Toán Khi Giao Hàng
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div className="row g-4 text-center align-items-center justify-content-center pt-4">
                            <button
                                type="button"
                                className="btn border-secondary py-3 px-4 text-uppercase w-100 text-primary"
                                onClick={selectedPaymentMethod === 'Momo' ? handleMoMoPayment : handlePostOrder}
                                disabled={!canProceedToCheckout}
                            >
                                Đặt Hàng
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
