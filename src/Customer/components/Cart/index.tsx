import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import Swal from 'sweetalert2';
import AxiosInstance from '../../../services/AxiosInstance';
import CartRow from './CartRow';

interface User {
    id: string;
    address?: string;
}

interface CartDetail {
    id: number;
    modelId: number;
    productName: string;
    productImage: string;
    price: number;
    quantity: number;
    quantityAvailable: number;
    amount: number;
}

const Cart: React.FC = () => {
    const [token, setToken] = useState<string | null>(null);
    const [user, setUser] = useState<User>({
        id: '',
        address: '',
    });
    const [cartDetails, setCartDetails] = useState<CartDetail[]>([]);
    const [total, setTotal] = useState(0);
    const [canProceedToCheckout, setCanProceedToCheckout] = useState(false);

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

        const hasError = cartDetails.some((detail) => detail.quantity > detail.quantityAvailable);
        setCanProceedToCheckout(!hasError);
    }, [cartDetails]);

    const handleUpdateCartDetailQuantity = async (id: number, quantity: number, amount: number) => {
        try {
            const response = await AxiosInstance.put(
                `/Carts/UpdateCartDetailQuantity/${id}`,
                { quantity, amount },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );

            if (response.status === 204) {
                setCartDetails((prevCartDetails) =>
                    prevCartDetails.map((cartDetail) =>
                        cartDetail.id === id ? { ...cartDetail, quantity, amount } : cartDetail,
                    ),
                );
            }
        } catch (error) {
            console.error('Lỗi khi cập nhật số lượng sản phẩm: ', error);
        }
    };

    const handleDeleteCartDetail = async (id: number) => {
        const confirmed = await Swal.fire({
            title: 'Xác nhận xoá sản phẩm khỏi giỏ hàng.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Xác nhận',
            confirmButtonColor: '#3085d6',
            cancelButtonText: 'Huỷ',
        });

        if (confirmed.isConfirmed) {
            try {
                const response = await AxiosInstance.delete(`/Carts/DeleteCartDetail/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.status === 204) {
                    setCartDetails((prevDetails) => prevDetails.filter((detail) => detail.id !== id));
                }
            } catch (error) {
                console.error('Lỗi khi xoá sản phẩm: ', error);
            }
        }
    };

    return (
        <div className="container-fluid py-5">
            <div className="container py-5">
                {cartDetails.length > 0 ? (
                    <>
                        <div className="table-responsive">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th scope="col">Sản phẩm</th>
                                        <th scope="col">Tên</th>
                                        <th scope="col">Giá</th>
                                        <th scope="col">Số lượng</th>
                                        <th scope="col">Tổng cộng</th>
                                        <th scope="col">Xử lý</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {cartDetails.map((cartDetail) => (
                                        <CartRow
                                            key={cartDetail.id}
                                            cartDetail={cartDetail}
                                            onUpdateQuantity={handleUpdateCartDetailQuantity}
                                            onDelete={() => handleDeleteCartDetail(cartDetail.id)}
                                        />
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="row g-4 justify-content-end">
                            <div className="col-sm-12 col-md-6 col-lg-6 col-xl-7">
                                <div className="mt-5">
                                    <input
                                        type="text"
                                        className="border-0 border-bottom rounded outline-none me-5 py-3 mb-4"
                                        placeholder="Mã giảm giá"
                                    />
                                    <button
                                        className="btn border-secondary rounded-pill px-4 py-3 text-primary"
                                        type="button"
                                    >
                                        Áp dụng
                                    </button>
                                </div>
                            </div>
                            <div className="col-sm-12 col-md-6 col-lg-6 col-xl-5">
                                <div className="bg-light rounded">
                                    <div className="p-4">
                                        <h1 className="display-6 mb-4">
                                            <span className="fw-normal">Tổng giỏ hàng</span>
                                        </h1>
                                        <div className="d-flex justify-content-between mb-4">
                                            <h5 className="mb-0 me-4">Thành tiền:</h5>
                                            <p className="mb-0">{total.toLocaleString() + ' ₫'}</p>
                                        </div>
                                        <div className="d-flex justify-content-between">
                                            <h5 className="mb-0 me-4">Phí vận chuyển:</h5>
                                            <div className="">
                                                <p className="mb-0">Phí cố định: 15.000 ₫</p>
                                            </div>
                                        </div>
                                        {user.address && (
                                            <p className="mb-0 mt-2 text-end">Vận chuyển đến: {user.address}</p>
                                        )}
                                    </div>
                                    <div className="py-4 mb-4 border-top border-bottom d-flex justify-content-between">
                                        <h5 className="mb-0 ps-4 me-4">Tổng thành tiền:</h5>
                                        <p className="mb-0 pe-4">{(total + 15000).toLocaleString() + ' ₫'}</p>
                                    </div>
                                    <div className="d-flex justify-content-center">
                                        {canProceedToCheckout && (
                                            <Link to="/thanh-toan">
                                                <button
                                                    className="btn border-secondary rounded-pill px-4 py-3 text-primary text-uppercase mb-4 ms-4"
                                                    type="button"
                                                >
                                                    Tiến hành thanh toán
                                                </button>
                                            </Link>
                                        )}
                                        {!canProceedToCheckout && (
                                            <button
                                                className="btn border-secondary rounded-pill px-4 py-3 text-primary text-uppercase mb-4 ms-4"
                                                type="button"
                                                disabled
                                            >
                                                Tiến hành thanh toán
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <h1 className="mb-4">Bạn chưa có sản phẩm nào trong giỏ hàng!</h1>
                )}
            </div>
        </div>
    );
};

export default Cart;
