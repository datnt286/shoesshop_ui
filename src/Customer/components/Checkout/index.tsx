import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import Swal from 'sweetalert2';
import AxiosInstance from '../../../services/AxiosInstance';
import TableRow from './TableRow';

interface User {
    id: string;
    userName: string;
    name?: string;
    email: string;
    phoneNumber?: string;
    address?: string;
}

interface CartDetail {
    id: number;
    modelId: number;
    productId: number;
    productName: string;
    productImage: string;
    price: number;
    quantity: number;
    amount: number;
}

const Checkout: React.FC = () => {
    const [token, setToken] = useState<string | null>(null);
    const [user, setUser] = useState<User>({
        id: '',
        userName: '',
        name: '',
        email: '',
        phoneNumber: '',
        address: '',
    });
    const [cartDetails, setCartDetails] = useState<CartDetail[]>([]);
    const [total, setTotal] = useState(0);
    const [selectedTransportMethod, setSelectedTransportMethod] = useState(1);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(1);
    const [note, setNote] = useState('');

    const fetchCartDetails = async () => {
        try {
            const response = await AxiosInstance.get(`/Carts/CartDetails/User/${user.id}`, {
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
                setUser({
                    id: decodedToken.id,
                    userName: decodedToken.userName,
                    name: decodedToken.name || '',
                    email: decodedToken.email || '',
                    phoneNumber: decodedToken.phoneNumber || '',
                    address: decodedToken.address || '',
                });
            } catch (error) {
                console.error('Token không hợp lệ: ', token);
            }
        }
    }, []);

    useEffect(() => {
        if (user.id) {
            fetchCartDetails();
        }
    }, [user.id]);

    useEffect(() => {
        const total = cartDetails.reduce((acc, item) => acc + item.amount, 0);
        setTotal(total);
    }, [cartDetails]);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target;

        setUser({
            ...user,
            [name]: value,
        });
    };

    const handleUpdateAccount = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const formData = new FormData();
        formData.append('userName', user.userName);
        formData.append('name', user.name || '');
        formData.append('email', user.email);
        formData.append('phoneNumber', user.phoneNumber || '');
        formData.append('address', user.address || '');

        try {
            const response = await AxiosInstance.put(`/Users/UpdateAccount`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.data.token) {
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

    const handleTransportMethodChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedTransportMethod(parseInt(event.target.value));
    };

    const handlePaymentMethodChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedPaymentMethod(parseInt(event.target.value));
    };

    const handleSubmitOrder = async () => {
        try {
            const data = {
                userId: user.id,
                total: total,
                shippingFee: selectedTransportMethod === 2 ? 15000 : selectedTransportMethod === 3 ? 10000 : 0,
                totalPayment:
                    total + (selectedTransportMethod === 2 ? 15000 : selectedTransportMethod === 3 ? 10000 : 0),
                note: note,
                status: 1,
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
                Swal.fire({
                    title: 'Đặt hàng thành công!',
                    icon: 'success',
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#3085d6',
                });
            }
        } catch (error) {
            console.error('Lỗi khi đặt hàng: ', error);

            Swal.fire({
                title: 'Đặt hàng thất bại! Vui lòng thử lại.',
                icon: 'error',
                confirmButtonText: 'OK',
                confirmButtonColor: '#3085d6',
            });
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
                                    value={user.name}
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
                            <div className="d-flex justify-content-end">
                                <button
                                    type="submit"
                                    className="btn border-secondary py-2 mt-3 rounded-pill text-uppercase w-25 text-primary"
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
                                        <td className="py-5">
                                            <p className="mb-0 text-dark py-4">Phí vận chuyển</p>
                                        </td>
                                        <td colSpan={3} className="py-5">
                                            <div className="form-check text-start">
                                                <input
                                                    type="radio"
                                                    name="transportMethod"
                                                    id="free-shipping"
                                                    className="form-check-input"
                                                    value={1}
                                                    onChange={handleTransportMethodChange}
                                                    checked={selectedTransportMethod === 1}
                                                />
                                                <label className="form-check-label" htmlFor="free-shipping">
                                                    Miễn phí vận chuyển
                                                </label>
                                            </div>
                                            <div className="form-check text-start">
                                                <input
                                                    type="radio"
                                                    name="transportMethod"
                                                    id="flat-rate"
                                                    className="form-check-input"
                                                    value={2}
                                                    onChange={handleTransportMethodChange}
                                                    checked={selectedTransportMethod === 2}
                                                />
                                                <label className="form-check-label" htmlFor="flat-rate">
                                                    Phí cố định: 15.000 ₫
                                                </label>
                                            </div>
                                            <div className="form-check text-start">
                                                <input
                                                    type="radio"
                                                    name="transportMethod"
                                                    id="local-pickup"
                                                    className="form-check-input"
                                                    value={3}
                                                    onChange={handleTransportMethodChange}
                                                    checked={selectedTransportMethod === 3}
                                                />
                                                <label className="form-check-label" htmlFor="local-pickup">
                                                    Nhận hàng tại địa phương: 10.000 ₫
                                                </label>
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
                                                <p className="mb-0 text-dark">{total.toLocaleString() + ' ₫'}</p>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="row g-4 text-center align-items-center justify-content-center border-bottom py-3">
                            <div className="col-12">
                                <div className="form-check text-start my-3">
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        id="transfer"
                                        className="form-check-input"
                                        value={1}
                                        onChange={handlePaymentMethodChange}
                                        checked={selectedPaymentMethod === 1}
                                    />
                                    <label className="form-check-label" htmlFor="transfer">
                                        Chuyển khoản trực tiếp
                                    </label>
                                </div>
                                <p className="text-start text-dark">
                                    Make your payment directly into our bank account. Please use your Order ID as the
                                    payment reference. Your order will not be shipped until the funds have cleared in
                                    our account.
                                </p>
                            </div>
                        </div>
                        <div className="row g-4 text-center align-items-center justify-content-center border-bottom py-3">
                            <div className="col-12">
                                <div className="form-check text-start my-3">
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        id="delivery"
                                        className="form-check-input"
                                        value={2}
                                        onChange={handlePaymentMethodChange}
                                        checked={selectedPaymentMethod === 2}
                                    />
                                    <label className="form-check-label" htmlFor="delivery">
                                        Thanh Toán Khi Giao Hàng
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div className="row g-4 text-center align-items-center justify-content-center border-bottom py-3">
                            <div className="col-12">
                                <div className="form-check text-start my-3">
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        id="paypal"
                                        className="form-check-input"
                                        value={3}
                                        onChange={handlePaymentMethodChange}
                                        checked={selectedPaymentMethod === 3}
                                    />
                                    <label className="form-check-label" htmlFor="paypal">
                                        Paypal
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div className="row g-4 text-center align-items-center justify-content-center pt-4">
                            <button
                                type="button"
                                className="btn border-secondary py-3 px-4 text-uppercase w-100 text-primary"
                                onClick={handleSubmitOrder}
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
