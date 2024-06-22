import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HeroImage1 from '../../resources/img/hero-1.png';
import HeroImage2 from '../../resources/img/hero-2.png';

const Hero: React.FC = () => {
    const [keyword, setKeyword] = useState('');
    const [validationError, setValidationError] = useState('');
    const navigate = useNavigate();

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

    return (
        <div className="container-fluid py-5 mb-5 hero-header">
            <div className="container py-5">
                <div className="row g-5 align-items-center">
                    <div className="col-md-12 col-lg-7">
                        <h4 className="mb-3 text-secondary">100% Organic Foods</h4>
                        <h1 className="mb-5 display-3 text-primary">Organic Veggies & Fruits Foods</h1>
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
                    <div className="col-md-12 col-lg-5">
                        <div id="carouselId" className="carousel slide position-relative" data-bs-ride="carousel">
                            <div className="carousel-inner" role="listbox">
                                <div className="carousel-item active rounded">
                                    <img
                                        src={HeroImage1}
                                        className="img-fluid w-100 h-100 bg-secondary rounded"
                                        alt="First slide"
                                    />
                                    <a href="#" className="btn px-4 py-2 text-white rounded">
                                        Fruites
                                    </a>
                                </div>
                                <div className="carousel-item rounded">
                                    <img
                                        src={HeroImage2}
                                        className="img-fluid w-100 h-100 rounded"
                                        alt="Second slide"
                                    />
                                    <a href="#" className="btn px-4 py-2 text-white rounded">
                                        Vesitables
                                    </a>
                                </div>
                            </div>
                            <button className="carousel-control-prev" data-bs-target="#carouselId" data-bs-slide="prev">
                                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                                <span className="visually-hidden">Trang trước</span>
                            </button>
                            <button className="carousel-control-next" data-bs-target="#carouselId" data-bs-slide="next">
                                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                                <span className="visually-hidden">Trang sau</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Hero;
