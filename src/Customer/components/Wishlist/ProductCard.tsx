import React from 'react';
import { Link } from 'react-router-dom';
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
    onDelete: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ wishlistDetail, onDelete }) => {
    const imageSrc = wishlistDetail.image ? `${config.baseURL}/images/product/${wishlistDetail.image}` : DefaultImage;

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
                    <div className="d-flex justify-content-between flex-lg-wrap">
                        <p className="text-dark fs-5 fw-bold mb-0">{wishlistDetail.price.toLocaleString() + ' ₫'}</p>
                        <button className="btn border border-secondary rounded-pill px-3 text-primary">
                            <i className="fa fa-shopping-bag me-2 text-primary"></i> Thêm vào giỏ hàng
                        </button>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default ProductCard;
