import React, { useEffect, useState } from 'react';
import AxiosInstance from '../../../services/AxiosInstance';
import ProductCard from './../ProductCard/index';
import Pagination from './../Pagination/index';
import ProductSection from './../ProductSection/index';

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

interface Brand {
    id: number;
    name: string;
    modelCount: number;
}

interface Color {
    id: number;
    name: string;
}

interface Size {
    id: number;
    name: string;
}

interface ShopProps {
    keyword?: string;
    heading: string;
}

const Shop: React.FC<ShopProps> = ({ keyword, heading }) => {
    const [models, setModels] = useState<Model[]>([]);
    const [brands, setBrands] = useState<Brand[]>([]);
    const [colors, setColors] = useState<Color[]>([]);
    const [sizes, setSizes] = useState<Size[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedBrandId, setSelectedBrandId] = useState<number | null>(null);
    const [selectedColorIds, setSelectedColorIds] = useState<number[]>([]);
    const [selectedSizeIds, setSelectedSizeIds] = useState<number[]>([]);
    const [searchKeyword, setSearchKeyword] = useState(keyword);
    const [validationError, setValidationError] = useState('');

    const fetchModels = async (currentPage = 1, pageSize = 12) => {
        try {
            const params: any = {
                currentPage,
                pageSize,
            };

            if (searchKeyword) {
                params.keyword = searchKeyword;
            }
            if (selectedBrandId) {
                params.brandId = selectedBrandId;
            }

            const queryParams = new URLSearchParams(params);

            selectedColorIds.forEach((colorId) => {
                queryParams.append('colorIds', colorId.toString());
            });

            selectedSizeIds.forEach((sizeId) => {
                queryParams.append('sizeIds', sizeId.toString());
            });

            const queryString = queryParams.toString();

            const response = await AxiosInstance.get(`/Models/paged?${queryString}`);

            if (response.status === 200) {
                setModels(response.data.items);
                setTotalPages(response.data.totalPages);
            }
        } catch (error) {
            console.error('Lỗi khi tải dữ liệu: ', error);
        }
    };

    const fetchBrands = async () => {
        try {
            const response = await AxiosInstance.get('/Brands/WithModelCount');

            if (response.status === 200) {
                setBrands(response.data);
            }
        } catch (error) {
            console.error('Lỗi khi tải dữ liệu: ', error);
        }
    };

    const fetchColors = async () => {
        try {
            const response = await AxiosInstance.get('/Colors');

            if (response.status === 200) {
                setColors(response.data);
            }
        } catch (error) {
            console.error('Lỗi khi tải dữ liệu: ', error);
        }
    };

    const fetchSizes = async () => {
        try {
            const response = await AxiosInstance.get('/Sizes');

            if (response.status === 200) {
                setSizes(response.data);
            }
        } catch (error) {
            console.error('Lỗi khi tải dữ liệu: ', error);
        }
    };

    useEffect(() => {
        fetchModels();
    }, [selectedBrandId, selectedColorIds, selectedSizeIds]);

    useEffect(() => {
        fetchBrands();
        fetchColors();
        fetchSizes();
    }, []);

    const handlePageChange = ({ selected }: { selected: number }) => {
        const currentPage = selected + 1;
        fetchModels(currentPage);
    };

    const handleBrandChange = (brandId: number) => {
        setSelectedBrandId(brandId);
    };

    const handleColorChange = (colorId: number) => {
        setSelectedColorIds((prevSelectedColors) =>
            prevSelectedColors.includes(colorId)
                ? prevSelectedColors.filter((id) => id !== colorId)
                : [...prevSelectedColors, colorId],
        );
    };

    const handleSizeChange = (sizeId: number) => {
        setSelectedSizeIds((prevSelectedSizes) =>
            prevSelectedSizes.includes(sizeId)
                ? prevSelectedSizes.filter((id) => id !== sizeId)
                : [...prevSelectedSizes, sizeId],
        );
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchKeyword(event.target.value);
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!searchKeyword) {
            setValidationError('Vui lòng nhập từ khoá!');
            return;
        }

        fetchModels();
    };

    const handleResetFilters = () => {
        setSelectedBrandId(null);
        setSelectedColorIds([]);
        setSelectedSizeIds([]);
        setSearchKeyword('');
        fetchModels();
    };

    return (
        <div className="container-fluid product py-5">
            <div className="container py-5">
                <h1 className="mb-4">{heading}</h1>
                <div className="row g-4">
                    <div className="col-lg-12">
                        <div className="row g-4">
                            <div className="col-xl-3">
                                <form onSubmit={handleSubmit}>
                                    <div className="input-group w-100 mx-auto d-flex">
                                        <input
                                            type="search"
                                            className="form-control p-3"
                                            onChange={handleInputChange}
                                            value={searchKeyword}
                                            placeholder={validationError ? validationError : 'Nhập từ khoá'}
                                            aria-describedby="search-icon"
                                        />
                                        <button type="submit" id="search-icon" className="input-group-text p-3">
                                            <i className="fa fa-search"></i>
                                        </button>
                                    </div>
                                </form>
                            </div>
                            <div className="col-5"></div>
                            <div className="col-xl-4">
                                <div className="d-flex justify-content-between">
                                    <button
                                        className="btn btn-light mb-4"
                                        style={{ color: '#45595b', fontWeight: '500' }}
                                        onClick={handleResetFilters}
                                    >
                                        <i className="fas fa-redo me-2"></i>Làm mới
                                    </button>
                                    <div className="bg-light ps-3 py-3 rounded d-flex justify-content-between mb-4">
                                        <label htmlFor="sort" className="mb-0" style={{ fontWeight: '500' }}>
                                            Sắp xếp theo:
                                        </label>
                                        <select
                                            id="sort"
                                            className="border-0 form-select-sm bg-light outline-none me-3"
                                        >
                                            <option value={1}>Nổi bật</option>
                                            <option value={2}>Mới nhất</option>
                                            <option value={3}>Bán chạy</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row g-4">
                            <div className="col-lg-3">
                                <div className="row g-4">
                                    <div className="col-lg-12">
                                        <div className="mb-3">
                                            <h4>Nhãn hiệu</h4>
                                            <ul className="list-unstyled product-categorie">
                                                {brands.map((brand) => (
                                                    <li key={brand.id}>
                                                        <div className="d-flex justify-content-between product-name">
                                                            <span
                                                                className="btn btn-link px-0"
                                                                onClick={() => handleBrandChange(brand.id)}
                                                            >
                                                                <i className="fas fa-tag me-2"></i>
                                                                {brand.name}
                                                            </span>
                                                            <span>({brand.modelCount})</span>
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                    <div className="col-lg-12">
                                        <div className="mb-3">
                                            <h4 className="mb-2">Mức giá</h4>
                                            <input
                                                type="range"
                                                className="form-range w-100"
                                                id="rangeInput"
                                                name="rangeInput"
                                                min={0}
                                                max={500}
                                                value={0}
                                            />
                                            <output
                                                id="amount"
                                                name="amount"
                                                min-velue="0"
                                                max-value="500"
                                                htmlFor="rangeInput"
                                            >
                                                0
                                            </output>
                                        </div>
                                    </div>
                                    <div className="col-lg-12">
                                        <div className="mb-3">
                                            <h4>Màu sắc</h4>
                                            {colors.map((color) => (
                                                <div key={color.id} className="form-check text-start">
                                                    <input
                                                        type="checkbox"
                                                        className="form-check-input"
                                                        id={`color-${color.id}`}
                                                        onChange={() => handleColorChange(color.id)}
                                                        checked={selectedColorIds.includes(color.id)}
                                                    />
                                                    <label className="form-check-label" htmlFor={`color-${color.id}`}>
                                                        {color.name}
                                                    </label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="col-lg-12">
                                        <div className="mb-3">
                                            <h4>Size</h4>
                                            {sizes.map((size) => (
                                                <div key={size.id} className="form-check text-start">
                                                    <input
                                                        type="checkbox"
                                                        className="form-check-input"
                                                        id={`size-${size.id}`}
                                                        onChange={() => handleSizeChange(size.id)}
                                                        checked={selectedSizeIds.includes(size.id)}
                                                    />
                                                    <label className="form-check-label" htmlFor={`size-${size.id}`}>
                                                        {size.name}
                                                    </label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <ProductSection />
                                </div>
                            </div>
                            <div className="col-lg-9">
                                <div className="row g-4 justify-content-center">
                                    {models?.map((model) => (
                                        <div key={model.id} className="col-md-6 col-lg-6 col-xl-4">
                                            <ProductCard model={model} />
                                        </div>
                                    ))}
                                    <div className="col-12">
                                        <Pagination totalPages={totalPages} onPageChange={handlePageChange} />
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

export default Shop;
