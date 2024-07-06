import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import AxiosInstance from '../../../services/AxiosInstance';
import config from '../../../services/config';
import DefaultImage from '../../resources/img/default-image.jpg';

interface Model {
    id: number;
    name: string;
    price: number;
    images: Image[];
}

interface Image {
    id: number;
    name: string;
}

interface ProductCardProps {
    model: Model;
    token: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ model, token }) => {
    const isLoggedIn = !!token;
    const navigate = useNavigate();

    const imageSrc =
        model.images && model.images.length > 0
            ? `${config.baseURL}/images/model/${model.images[0].name}`
            : DefaultImage;

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
                        confirmButtonText: 'OK',
                        confirmButtonColor: '#3085d6',
                    });
                }
            } catch (error) {
                console.error('Lỗi khi thêm sản phẩm vào giỏ hàng: ', error);

                Swal.fire({
                    title: 'Đã xảy ra lỗi khi thêm sản phẩm vào giỏ hàng! Vui lòng thử lại sau.',
                    icon: 'error',
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#3085d6',
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

    return (
        <div className="col-md-6 col-lg-6 col-xl-3">
            <Link to={`/san-pham/${model.id}`}>
                <div className="text-center">
                    <img src={imageSrc} className="img-fluid rounded" alt="Ảnh sản phẩm" />
                    <div className="py-4">
                        <span className="h5 line-clamp line-clamp-2">{model.name}</span>
                        <h4 className="mt-1 mb-3">{model.price.toLocaleString() + ' ₫'}</h4>
                        <button
                            className="btn border border-secondary rounded-pill px-3 text-primary"
                            onClick={handleAddToCart}
                        >
                            <i className="fa fa-shopping-bag me-2 text-primary"></i> Thêm vào giỏ hàng
                        </button>
                    </div>
                </div>
            </Link>
        </div>
    );
};

export default ProductCard;
