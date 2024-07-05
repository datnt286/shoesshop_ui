import React, { useEffect, useState } from 'react';
import AxiosInstance from '../../../services/AxiosInstance';
import ProductCard from './ProductCard';

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

const Bestseller: React.FC = () => {
    const [models, setModels] = useState<Model[]>([]);
    const [token, setToken] = useState<string | null>(null);

    const fetchModels = async () => {
        try {
            const response = await AxiosInstance.get('/Models/best-selling', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.status === 200) {
                setModels(response.data);
            }
        } catch (error) {
            console.error('Lỗi khi tải dữ liệu: ', error);
        }
    };

    useEffect(() => {
        fetchModels();
    }, [token]);

    useEffect(() => {
        const token = localStorage.getItem('customerToken');
        setToken(token);
    }, []);

    return (
        <div className="container-fluid py-5">
            <div className="container py-5">
                <div className="text-center mx-auto mb-5" style={{ maxWidth: '700px' }}>
                    <h1 className="display-4">Sản phẩm bán chạy</h1>
                </div>
                <div className="row g-4">
                    {models.map((model) => (
                        <ProductCard key={model.id} model={model} token={token || ''} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Bestseller;
