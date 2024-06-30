import React from 'react';
import { Link } from 'react-router-dom';
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
    const imageSrc =
        model.images && model.images.length > 0
            ? `${config.baseURL}/images/model/${model.images[0].name}`
            : DefaultImage;

    return (
        <Link to={`/san-pham/${model.id}`}>
            <div className="border border-primary rounded position-relative vesitable-item">
                <div className="vesitable-img">
                    <img
                        src={imageSrc}
                        className="img-fluid w-100 rounded-top"
                        style={{ maxHeight: '260px' }}
                        alt="Ảnh sản phẩm"
                    />
                </div>
                <div
                    className="text-white bg-danger px-3 py-1 rounded position-absolute"
                    style={{ top: '10px', left: '10px' }}
                >
                    -20%
                </div>
                <button
                    className="btn border border-secondary rounded-pill px-3 py-2 ml-3 mb-4 text-primary position-absolute"
                    style={{ top: '10px', right: '10px' }}
                >
                    <i className="far fa-heart"></i>
                </button>
                <div className="p-4 rounded-bottom">
                    <h4 className="line-clamp line-clamp-2">{model.name}</h4>
                    <div className="d-flex justify-content-between flex-lg-wrap">
                        <p className="text-dark fs-5 fw-bold mb-0">{model.price.toLocaleString() + ' ₫'}</p>
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
