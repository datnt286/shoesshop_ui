import React, { useEffect, useState } from 'react';
import AxiosInstance from '../../../services/AxiosInstance';
import ProductCard from './../ProductCard/index';

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

const FeaturedProducts: React.FC = () => {
    const [allModels, setAllModels] = useState<Model[]>([]);
    const [shoesModels, setShoesModels] = useState<Model[]>([]);
    const [accessoriesModels, setAccessoriesModels] = useState<Model[]>([]);
    const [token, setToken] = useState<string | null>(null);

    const fetchModels = async () => {
        try {
            const response = await AxiosInstance.get('/Models/All');

            if (response.status === 200) {
                setAllModels(response.data.allModels);
                setShoesModels(response.data.shoesModels);
                setAccessoriesModels(response.data.accessoriesModels);
            }
        } catch (error) {
            console.error('Lỗi khi tải dữ liệu: ', error);
        }
    };

    useEffect(() => {
        fetchModels();
    }, []);

    useEffect(() => {
        const token = localStorage.getItem('customerToken');
        setToken(token);
    }, []);

    const handleWishlistChange = (modelId: number, isInWishlist: boolean) => {
        setAllModels((prevModels) =>
            prevModels.map((model) => (model.id === modelId ? { ...model, isInWishlist } : model)),
        );

        setShoesModels((prevShoesModels) =>
            prevShoesModels.map((model) => (model.id === modelId ? { ...model, isInWishlist } : model)),
        );

        setAccessoriesModels((prevAccessoriesModels) =>
            prevAccessoriesModels.map((model) => (model.id === modelId ? { ...model, isInWishlist } : model)),
        );
    };

    return (
        <div className="container-fluid product py-5">
            <div className="container py-5">
                <div className="tab-class text-center">
                    <div className="row g-4">
                        <div className="col-lg-4 text-start">
                            <h1>Sản phẩm nổi bật</h1>
                        </div>
                        <div className="col-lg-8 text-end">
                            <ul className="nav nav-pills d-inline-flex text-center mb-5">
                                <li className="nav-item">
                                    <a
                                        href="#tab-1"
                                        className="d-flex m-2 py-2 bg-light rounded-pill active"
                                        data-bs-toggle="pill"
                                    >
                                        <span className="text-dark" style={{ width: '130px' }}>
                                            Tất cả
                                        </span>
                                    </a>
                                </li>
                                <li className="nav-item">
                                    <a
                                        href="#tab-2"
                                        className="d-flex py-2 m-2 bg-light rounded-pill"
                                        data-bs-toggle="pill"
                                    >
                                        <span className="text-dark" style={{ width: '130px' }}>
                                            Giày
                                        </span>
                                    </a>
                                </li>
                                <li className="nav-item">
                                    <a
                                        href="#tab-3"
                                        className="d-flex m-2 py-2 bg-light rounded-pill"
                                        data-bs-toggle="pill"
                                    >
                                        <span className="text-dark" style={{ width: '130px' }}>
                                            Phụ kiện khác
                                        </span>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="tab-content">
                        <div id="tab-1" className="tab-pane fade show p-0 active">
                            <div className="row g-4">
                                <div className="col-lg-12">
                                    <div className="row g-4">
                                        {allModels?.slice(0, 8).map((model) => (
                                            <div className="col-md-6 col-lg-4 col-xl-3">
                                                <ProductCard
                                                    key={model.id}
                                                    model={model}
                                                    token={token || ''}
                                                    onWishlistChange={handleWishlistChange}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div id="tab-2" className="tab-pane fade show p-0">
                            <div className="row g-4">
                                <div className="col-lg-12">
                                    <div className="row g-4">
                                        {shoesModels?.slice(0, 8).map((model) => (
                                            <div className="col-md-6 col-lg-4 col-xl-3">
                                                <ProductCard
                                                    key={model.id}
                                                    model={model}
                                                    token={token || ''}
                                                    onWishlistChange={handleWishlistChange}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div id="tab-3" className="tab-pane fade show p-0">
                            <div className="row g-4">
                                <div className="col-lg-12">
                                    <div className="row g-4">
                                        {accessoriesModels?.slice(0, 8).map((model) => (
                                            <div className="col-md-6 col-lg-4 col-xl-3">
                                                <ProductCard
                                                    key={model.id}
                                                    model={model}
                                                    token={token || ''}
                                                    onWishlistChange={handleWishlistChange}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FeaturedProducts;
