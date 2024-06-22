import React, { useEffect, useState } from 'react';
import AxiosInstance from '../../../services/AxiosInstance';
import OwlCarousel from 'react-owl-carousel';
import ProductCard from './ProductCard';

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
}

interface Image {
    id: number;
    name: string;
}

const ProductSlider: React.FC = () => {
    const [models, setModels] = useState<Model[]>([]);

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

    return (
        <div className="container-fluid vesitable py-5">
            <div className="container py-5">
                <h1 className="mb-0">Sản phẩm mới</h1>

                <OwlCarousel {...carouselOptions} className="owl-carousel vegetable-carousel justify-content-center">
                    {models?.map((model) => (
                        <ProductCard key={model.id} model={model} />
                    ))}
                </OwlCarousel>
            </div>
        </div>
    );
};

export default ProductSlider;
