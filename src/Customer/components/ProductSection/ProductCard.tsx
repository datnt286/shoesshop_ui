import React from 'react';
import { useNavigate } from 'react-router-dom';
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
}

const ProductCard: React.FC<ProductCardProps> = ({ model }) => {
    const navigate = useNavigate();
    const imageSrc =
        model.images && model.images.length > 0
            ? `${config.baseURL}/images/model/${model.images[0].name}`
            : DefaultImage;

    const handleClick = () => {
        navigate(`/san-pham/${model.id}`);
        window.location.reload();
    };

    return (
        <div className="d-flex align-items-center justify-content-start cursor-pointer" onClick={handleClick}>
            <div className="rounded mb-3" style={{ width: '100px', height: '100px' }}>
                <img
                    src={imageSrc}
                    className="img-fluid rounded"
                    style={{ width: '100px', height: '100px' }}
                    alt="Ảnh sản phẩm"
                />
            </div>
            <div className="mx-2">
                <h6 className="line-clamp line-clamp-2 mb-2">{model.name}</h6>
                <div className="d-flex mb-2">
                    <h5 className="fw-bold me-2">{model.price.toLocaleString() + ' ₫'}</h5>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
