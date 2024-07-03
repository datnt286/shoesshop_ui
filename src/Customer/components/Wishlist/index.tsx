import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import Swal from 'sweetalert2';
import AxiosInstance from '../../../services/AxiosInstance';
import ProductCard from './ProductCard';
import Pagination from '../Pagination/index';

interface WishlistDetail {
    id: number;
    modelId: number;
    productId: number;
    productName: string;
    price: number;
    image: string;
}

const Wishlist: React.FC = () => {
    const [token, setToken] = useState<string | null>(null);
    const [wishlistDetails, setWishlistDetails] = useState<WishlistDetail[]>([]);
    const [totalPages, setTotalPages] = useState(1);

    const fetchWishlistDetails = async (currentPage = 1, pageSize = 12) => {
        try {
            const response = await AxiosInstance.get('/Wishlists/WishlistDetails/User', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params: {
                    currentPage,
                    pageSize,
                },
            });

            if (response.status === 200) {
                setWishlistDetails(response.data.items);
                setTotalPages(response.data.totalPages);
            }
        } catch (error) {
            console.error('Lỗi khi tải dữ liệu: ', error);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('customerToken');
        setToken(token);
    }, []);

    useEffect(() => {
        if (token) {
            fetchWishlistDetails();
        }
    }, [token]);

    const handlePageChange = ({ selected }: { selected: number }) => {
        const currentPage = selected + 1;
        fetchWishlistDetails(currentPage);
    };

    const deleteWishlistDetail = async (id: number) => {
        const confirmed = await Swal.fire({
            title: 'Xác nhận xoá sản phẩm khỏi Wishlist.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Xác nhận',
            confirmButtonColor: '#3085d6',
            cancelButtonText: 'Huỷ',
        });

        if (confirmed.isConfirmed) {
            try {
                const response = await AxiosInstance.delete(`/Wishlists/DeleteWishlistDetail/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.status === 204) {
                    setWishlistDetails((prevDetails) => prevDetails.filter((detail) => detail.id !== id));
                }
            } catch (error) {
                console.error('Lỗi khi xoá sản phẩm: ', error);
            }
        }
    };

    return (
        <div className="container-fluid product py-5">
            <div className="container py-5">
                {wishlistDetails.length > 0 ? (
                    <div className="row g-4">
                        <div className="col-lg-12">
                            <div className="row g-4 justify-content-center">
                                {wishlistDetails?.map((wishlistDetail) => (
                                    <div key={wishlistDetail.id} className="col-md-6 col-lg-4 col-xl-3">
                                        <ProductCard
                                            wishlistDetail={wishlistDetail}
                                            token={token || ''}
                                            onDelete={() => deleteWishlistDetail(wishlistDetail.id)}
                                        />
                                    </div>
                                ))}
                                <div className="col-12">
                                    <Pagination totalPages={totalPages} onPageChange={handlePageChange} />
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <h1 className="mb-4">Bạn chưa có sản phẩm nào trong Wishlist!</h1>
                )}
            </div>
        </div>
    );
};

export default Wishlist;
