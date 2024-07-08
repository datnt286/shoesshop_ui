import React from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import AxiosInstance from '../../../services/AxiosInstance';
import config from '../../../services/config';
import DefaultImage from '../../resources/img/default-image.jpg';

interface WishlistDetail {
    id: number;
    modelId: number;
    productId: number;
    productName: string;
    price: number;
    image: string;
}

interface ProductCardProps {
    wishlistDetail: WishlistDetail;
    token: string;
    onDelete: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ wishlistDetail, token, onDelete }) => {
    const imageSrc = wishlistDetail.image ? `${config.baseURL}/images/product/${wishlistDetail.image}` : DefaultImage;

    const handleAddToCart = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.preventDefault();
        event.stopPropagation();

        if (token) {
            try {
                const data = {
                    productId: wishlistDetail.productId,
                    price: wishlistDetail.price,
                };

                const response = await AxiosInstance.post('/Carts/AddToCart', data, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.status === 200) {
                    Swal.fire({
                        title: 'Đã thêm sản phẩm vào giỏ hàng!',
                        icon: 'success',
                        confirmButtonText: 'OK',
                        confirmButtonColor: '#3085d6',
                    });
                }
            } catch (error) {
                console.error('Lỗi khi thêm sản phẩm vào giỏ hàng: ', error);

                Swal.fire({
                    title: 'Đã xảy ra lỗi khi thêm sản phẩm vào giỏ hàng!',
                    icon: 'error',
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#3085d6',
                });
            }
        }
    };

    const handleDeleteClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        event.preventDefault();
        event.stopPropagation();
        onDelete();
    };

    return (
        <Link to={`/san-pham/${wishlistDetail.modelId}`}>
            <div className="rounded position-relative product-item">
                <div className="product-img">
                    <img
                        src={imageSrc}
                        className="img-fluid w-100 rounded-top"
                        style={{ maxHeight: '260px' }}
                        loading="lazy"
                        alt="Ảnh sản phẩm"
                    />
                </div>
                <div
                    className="text-white bg-danger px-3 py-2 rounded position-absolute"
                    style={{ top: '0', right: '0' }}
                    onClick={handleDeleteClick}
                >
                    <i className="fas fa-times"></i>
                </div>
                <div className="p-4 border border-secondary border-top-0 rounded-bottom">
                    <h4 className="line-clamp line-clamp-2">{wishlistDetail.productName}</h4>
                    <div className="d-flex justify-content-center flex-lg-wrap">
                        <p className="text-dark fs-5 fw-bold mb-0">{wishlistDetail.price.toLocaleString() + ' ₫'}</p>
                        {/* <button
                            className="btn border border-secondary rounded-pill px-3 text-primary"
                            onClick={handleAddToCart}
                        >
                            <i className="fa fa-shopping-bag me-2 text-primary"></i> Thêm vào giỏ hàng
                        </button> */}
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default ProductCard;
