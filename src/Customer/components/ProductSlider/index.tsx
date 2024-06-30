import React, { useEffect, useState } from 'react';
import OwlCarousel from 'react-owl-carousel';
import AxiosInstance from '../../../services/AxiosInstance';
import ProductCard from './../ProductCard/index';

const carouselOptions = {
    autoplay: true,
    smartSpeed: 1500,
    center: false,
    dots: false,
    loop: true,
    margin: 25,
    nav: true,
    navText: ['<i class="bi bi-arrow-left"></i>', '<i class="bi bi-arrow-right"></i>'],
    responsiveClass: true,
    responsive: {
        0: {
            items: 1,
        },
        576: {
            items: 1,
        },
        768: {
            items: 2,
        },
        992: {
            items: 3,
        },
        1200: {
            items: 4,
        },
    },
};

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

const ProductSlider: React.FC = () => {
    const [models, setModels] = useState<Model[]>([]);
    const [token, setToken] = useState<string | null>(null);

    const fetchModels = async () => {
        try {
            const response = await AxiosInstance.get('/Models');

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

    useEffect(() => {
        const token = localStorage.getItem('customerToken');
        setToken(token);
    }, []);

    return (
        <div className="container-fluid product py-5">
            <div className="container py-5">
                <h1 className="mb-0">Sản phẩm mới</h1>
                <OwlCarousel {...carouselOptions} className="owl-carousel justify-content-center">
                    {models?.map((model) => (
                        <ProductCard key={model.id} model={model} token={token || ''} />
                    ))}
                </OwlCarousel>
            </div>
        </div>
    );
};

export default ProductSlider;
