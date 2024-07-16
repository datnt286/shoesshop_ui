import React from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import AxiosInstance from '../../../services/AxiosInstance';
import config from '../../../services/config';
import DefaultImage from '../../resources/img/default-image.jpg';

interface Model {
    id: number;
    name: string;
    price: number;
    images: Image[];
    isInWishlist: boolean;
}

interface Image {
    id: number;
    name: string;
}

interface ProductCardProps {
    model: Model;
    token: string;
    onWishlistChange: (modelId: number, isInWishlist: boolean) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ model, token, onWishlistChange }) => {
    const isLoggedIn = !!token;
    const navigate = useNavigate();

    const imageSrc =
        model.images && model.images.length > 0
            ? `${config.baseURL}/images/model/${model.images[0].name}`
            : DefaultImage;

    const handleClick = () => {
        navigate(`/san-pham/${model.id}`);
        window.location.reload();
    };

    const handleAddToCart = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.preventDefault();
        event.stopPropagation();

        if (isLoggedIn) {
            try {
                const response = await AxiosInstance.post(
                    `/Carts/AddToCart/Model/${model.id}`,
                    {},
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    },
                );

                if (response.status === 200) {
                    Swal.fire({
                        title: 'Đã thêm sản phẩm vào giỏ hàng!',
                        icon: 'success',
                        toast: true,
                        position: 'top-end',
                        timerProgressBar: true,
                        showConfirmButton: false,
                        timer: 1000,
                    });
                }
            } catch (error) {
                console.error('Lỗi khi thêm sản phẩm vào giỏ hàng: ', error);

                Swal.fire({
                    title: 'Đã xảy ra lỗi khi thêm sản phẩm vào giỏ hàng! Vui lòng thử lại sau.',
                    icon: 'error',
                    toast: true,
                    position: 'top-end',
                    timerProgressBar: true,
                    showConfirmButton: false,
                    timer: 3000,
                });
            }
        } else {
            const result = await Swal.fire({
                title: 'Bạn chưa đăng nhập tài khoản!',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Chuyển đến trang đăng nhập',
                confirmButtonColor: '#3085d6',
                cancelButtonText: 'Huỷ',
            });

            if (result.isConfirmed) {
                navigate('/dang-nhap');
            }
        }
    };

    const handleAddToWishlist = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.preventDefault();
        event.stopPropagation();

        if (isLoggedIn) {
            if (!model.isInWishlist) {
                try {
                    const response = await AxiosInstance.post(
                        `/Wishlists/AddToWishlist/Model/${model?.id}`,
                        {},
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        },
                    );

                    if (response.status === 200) {
                        onWishlistChange(model.id, !model.isInWishlist);

                        Swal.fire({
                            title: 'Đã thêm sản phẩm vào Wishlist!',
                            icon: 'success',
                            toast: true,
                            position: 'top-end',
                            timerProgressBar: true,
                            showConfirmButton: false,
                            timer: 1000,
                        });
                    }
                } catch (error) {
                    console.error('Lỗi khi thêm sản phẩm vào Wishlist: ', error);

                    Swal.fire({
                        title: 'Đã xảy ra lỗi khi thêm sản phẩm vào Wishlist!',
                        icon: 'error',
                        toast: true,
                        position: 'top-end',
                        timerProgressBar: true,
                        showConfirmButton: false,
                        timer: 3000,
                    });
                }
            } else {
                try {
                    const response = await AxiosInstance.delete(`/Wishlists/DeleteWishlistDetail/Model/${model.id}`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });

                    if (response.status === 204) {
                        onWishlistChange(model.id, !model.isInWishlist);

                        Swal.fire({
                            title: 'Đã xoá sản phẩm khỏi Wishlist!',
                            icon: 'success',
                            toast: true,
                            position: 'top-end',
                            timerProgressBar: true,
                            showConfirmButton: false,
                            timer: 1000,
                        });
                    }
                } catch (error) {
                    console.error('Lỗi khi xoá sản phẩm khỏi Wishlist: ', error);

                    Swal.fire({
                        title: 'Đã xảy ra lỗi khi xoá sản phẩm khỏi Wishlist!',
                        icon: 'error',
                        toast: true,
                        position: 'top-end',
                        timerProgressBar: true,
                        showConfirmButton: false,
                        timer: 3000,
                    });
                }
            }
        } else {
            const result = await Swal.fire({
                title: 'Bạn chưa đăng nhập tài khoản!',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Chuyển đến trang đăng nhập',
                confirmButtonColor: '#3085d6',
                cancelButtonText: 'Huỷ',
            });

            if (result.isConfirmed) {
                navigate('/dang-nhap');
            }
        }
    };

    return (
        <div className="rounded position-relative product-item cursor-pointer" onClick={handleClick}>
            <div className="product-img">
                <img
                    src={imageSrc}
                    className="img-fluid w-100 rounded-top"
                    style={{ maxHeight: '260px' }}
                    loading="lazy"
                    alt="Ảnh sản phẩm"
                />
            </div>
            {/* <div
                    className="text-white bg-danger px-3 py-1 rounded position-absolute"
                    style={{ top: '10px', left: '10px' }}
                >
                    -20%
                </div> */}
            <button
                className={`btn border border-secondary rounded-pill px-3 py-2 ml-3 mb-4 position-absolute ${
                    model?.isInWishlist ? 'text-danger' : 'text-primary'
                }`}
                style={{ top: '10px', right: '10px' }}
                onClick={handleAddToWishlist}
            >
                <i className={`${model.isInWishlist ? 'fas' : 'far'} fa-heart`}></i>
            </button>
            <div className="p-4 border border-secondary border-top-0 rounded-bottom">
                <h4 className="line-clamp line-clamp-2">{model.name}</h4>
                <div className="d-flex justify-content-center flex-lg-wrap">
                    <p className="text-dark fs-5 fw-bold mb-0">{model.price.toLocaleString() + ' ₫'}</p>
                    {/* <button
                            className="btn border border-secondary rounded-pill px-3 text-primary"
                            onClick={handleAddToCart}
                        >
                            <i className="fa fa-shopping-bag me-2 text-primary"></i> Thêm vào giỏ hàng
                        </button> */}
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
