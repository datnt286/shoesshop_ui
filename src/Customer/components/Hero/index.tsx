import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import OwlCarousel from 'react-owl-carousel';
import AxiosInstance from '../../../services/AxiosInstance';
import config from '../../../services/config';
import DefaultImage from '../../resources/img/default-image.jpg';

const carouselOptions = {
    items: 1,
    loop: true,
    nav: false,
    dots: false,
    autoplay: true,
    autoplayTimeout: 5000,
    smartSpeed: 1000,
};

interface Slider {
    id: number | null;
    name: string;
    image: string | null;
    modelId: number;
}

const Hero: React.FC = () => {
    const [sliders, setSliders] = useState<Slider[]>([]);
    const [keyword, setKeyword] = useState('');
    const [validationError, setValidationError] = useState('');
    const carouselRef = useRef<OwlCarousel>(null);
    const navigate = useNavigate();

    const fetchSliders = async () => {
        try {
            const response = await AxiosInstance.get('/Sliders/actived');

            if (response.status === 200) {
                setSliders(response.data);
            }
        } catch (error) {
            console.error('Lỗi khi tải dữ liệu: ', error);
        }
    };

    useEffect(() => {
        fetchSliders();
    }, []);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setKeyword(event.target.value);
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!keyword) {
            setValidationError('Vui lòng nhập từ khoá!');
            return;
        }

        navigate(`/tim-kiem/${keyword}`);
    };

    const handlePrevClick = () => {
        carouselRef.current?.prev(300);
    };

    const handleNextClick = () => {
        carouselRef.current?.next(300);
    };

    return (
        <div className="container-fluid py-5 mb-5 hero-header">
            <div className="container py-5">
                <div className="row g-5 align-items-center">
                    <div className="col-md-12 col-lg-7">
                        <h1 className="mb-5 display-3 text-primary">Double D Shop</h1>
                        <div className="position-relative mx-auto">
                            <form onSubmit={handleSubmit}>
                                <input
                                    type="search"
                                    className="form-control border-2 border-secondary w-75 py-3 px-4 rounded-pill"
                                    onChange={handleInputChange}
                                    placeholder={validationError ? validationError : 'Nhập từ khoá'}
                                />
                                <button
                                    type="submit"
                                    className="btn btn-primary border-2 border-secondary py-3 px-4 position-absolute rounded-pill text-white h-100"
                                    style={{ top: '0', right: '25%' }}
                                >
                                    Tìm kiếm
                                </button>
                            </form>
                        </div>
                    </div>
                    <div className="col-md-12 col-lg-5 position-relative">
                        {sliders.length > 0 && (
                            <OwlCarousel
                                key={sliders.length}
                                ref={carouselRef}
                                className="carousel slide position-relative"
                                {...carouselOptions}
                            >
                                {sliders.map((slider, index) => {
                                    const imageSrc = slider.image
                                        ? `${config.baseURL}/images/slider/${slider.image}`
                                        : DefaultImage;

                                    return (
                                        <Link key={index} to={`/san-pham/${slider.modelId}`}>
                                            <div className={`carousel-item active rounded`}>
                                                <img
                                                    src={imageSrc}
                                                    className="img-fluid w-100 h-100 bg-secondary rounded"
                                                    style={{ width: '600px', height: '400px' }}
                                                    alt="Hình ảnh"
                                                />
                                            </div>
                                        </Link>
                                    );
                                })}
                            </OwlCarousel>
                        )}
                        <button
                            className="carousel-control-prev"
                            style={{ marginLeft: '40px' }}
                            onClick={handlePrevClick}
                        >
                            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                            <span className="visually-hidden">Trang trước</span>
                        </button>
                        <button
                            className="carousel-control-next"
                            style={{ marginRight: '40px' }}
                            onClick={handleNextClick}
                        >
                            <span className="carousel-control-next-icon" aria-hidden="true"></span>
                            <span className="visually-hidden">Trang sau</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Hero;
