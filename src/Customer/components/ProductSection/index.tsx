import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AxiosInstance from '../../../services/AxiosInstance';
import ProductCard from './ProductCard';
import bannerImage from '../../resources/img/section-banner.jpg';

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

const ProductSection: React.FC = () => {
    const [models, setModels] = useState<Model[]>([]);

    const fetchModels = async () => {
        try {
            const response = await AxiosInstance.get('/Models/featured');

            if (response.status === 200) {
                setModels(response.data);
            }
        } catch (error) {
            console.error('Lỗi khi tải dữ liệu: ', error);
        }
    };

    useEffect(() => {
        fetchModels();
    }, []);

    return (
        <>
            <div className="col-lg-12">
                <h4 className="mb-4">Sản phẩm nổi bật</h4>
                {models.map((model) => (
                    <ProductCard model={model} />
                ))}
                <div className="d-flex justify-content-center my-4">
                    <Link
                        to="/cua-hang"
                        className="btn border border-secondary px-4 py-3 rounded-pill text-primary w-100"
                    >
                        Xem thêm
                    </Link>
                </div>
            </div>
            <div className="col-lg-12">
                <div className="position-relative">
                    <img src={bannerImage} className="img-fluid w-100 rounded" alt="Hình ảnh" />
                    <div
                        className="position-absolute"
                        style={{ top: '50%', right: '10px', transform: 'translateY(-50%)' }}
                    ></div>
                </div>
            </div>
        </>
    );
};

export default ProductSection;
