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
    isInWishlist: boolean;
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

interface ProductType {
    id: number;
    name: string;
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
    productTypeId?: number;
    heading: string;
}

const Shop: React.FC<ShopProps> = ({ keyword, productTypeId, heading }) => {
    const [models, setModels] = useState<Model[]>([]);
    const [brands, setBrands] = useState<Brand[]>([]);
    const [productTypes, setProductTypes] = useState<ProductType[]>([]);
    const [colors, setColors] = useState<Color[]>([]);
    const [sizes, setSizes] = useState<Size[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedBrandId, setSelectedBrandId] = useState<number | null>(null);
    const [selectedProductTypeIds, setSelectedProductTypeIds] = useState<number[]>([]);
    const [selectedColorIds, setSelectedColorIds] = useState<number[]>([]);
    const [selectedSizeIds, setSelectedSizeIds] = useState<number[]>([]);
    const [searchKeyword, setSearchKeyword] = useState(keyword);
    const [addedProductTypeId, setAddedProductTypeId] = useState(true);
    const [validationError, setValidationError] = useState('');
    const [token, setToken] = useState<string | null>(null);

    const fetchModels = async (currentPage = 1, pageSize = 12) => {
        try {
            const params: any = {
                currentPage,
                pageSize,
            };

            if (searchKeyword) {
                params.keyword = searchKeyword;
            }

            if (productTypeId && addedProductTypeId) {
                params.productTypeIds = productTypeId.toString();
            }

            if (selectedBrandId) {
                params.brandId = selectedBrandId;
            }

            const queryParams = new URLSearchParams(params);

            selectedProductTypeIds.forEach((productTypeId) => {
                queryParams.append('productTypeIds', productTypeId.toString());
            });

            selectedColorIds.forEach((colorId) => {
                queryParams.append('colorIds', colorId.toString());
            });

            selectedSizeIds.forEach((sizeId) => {
                queryParams.append('sizeIds', sizeId.toString());
            });

            const queryString = queryParams.toString();

            const response = await AxiosInstance.get(`/Models/paged?${queryString}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

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

    const fetchProductTypes = async () => {
        try {
            const response = await AxiosInstance.get('/ProductTypes/ChildProductTypes');

            if (response.status === 200) {
                setProductTypes(response.data);
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
    }, [selectedBrandId, selectedProductTypeIds, selectedColorIds, selectedSizeIds]);

    useEffect(() => {
        if (token) {
            fetchModels();
        }
    }, [token]);

    useEffect(() => {
        fetchBrands();
        fetchProductTypes();
        fetchColors();
        fetchSizes();
    }, []);

    useEffect(() => {
        if (productTypeId !== undefined && productTypeId !== null) {
            setSelectedProductTypeIds([productTypeId]);
        } else {
            setSelectedProductTypeIds([]);
        }
    }, [productTypeId]);

    useEffect(() => {
        const token = localStorage.getItem('customerToken');
        setToken(token);
    }, []);

    const handlePageChange = ({ selected }: { selected: number }) => {
        const currentPage = selected + 1;
        fetchModels(currentPage);
    };

    const handleBrandChange = (brandId: number) => {
        setSelectedBrandId(brandId);
        setAddedProductTypeId(false);
    };

    const handleProductTypeChange = (productTypeId: number) => {
        setSelectedProductTypeIds((prevSelectedProductTypeIds) =>
            prevSelectedProductTypeIds.includes(productTypeId)
                ? prevSelectedProductTypeIds.filter((id) => id !== productTypeId)
                : [...prevSelectedProductTypeIds, productTypeId],
        );
        setAddedProductTypeId(false);
    };

    const handleColorChange = (colorId: number) => {
        setSelectedColorIds((prevSelectedColors) =>
            prevSelectedColors.includes(colorId)
                ? prevSelectedColors.filter((id) => id !== colorId)
                : [...prevSelectedColors, colorId],
        );
        setAddedProductTypeId(false);
    };

    const handleSizeChange = (sizeId: number) => {
        setSelectedSizeIds((prevSelectedSizes) =>
            prevSelectedSizes.includes(sizeId)
                ? prevSelectedSizes.filter((id) => id !== sizeId)
                : [...prevSelectedSizes, sizeId],
        );
        setAddedProductTypeId(false);
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!searchKeyword) {
            setValidationError('Vui lòng nhập từ khoá!');
            return;
        }

        setAddedProductTypeId(false);
        fetchModels();
    };

    const handleResetFilters = () => {
        setSelectedBrandId(null);
        setSelectedProductTypeIds([]);
        setSelectedColorIds([]);
        setSelectedSizeIds([]);
        setSearchKeyword('');
        setAddedProductTypeId(false);
        fetchModels();
    };

    const handleWishlistChange = (modelId: number, isInWishlist: boolean) => {
        setModels((prevModels) =>
            prevModels.map((model) => (model.id === modelId ? { ...model, isInWishlist } : model)),
        );
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
                                            value={searchKeyword}
                                            onChange={(e) => setSearchKeyword(e.target.value)}
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
                                            <h4>Loại sản phẩm</h4>
                                            {productTypes.map((productType) => (
                                                <div key={productType.id} className="form-check text-start">
                                                    <input
                                                        type="checkbox"
                                                        className="form-check-input"
                                                        id={`productType-${productType.id}`}
                                                        onChange={() => handleProductTypeChange(productType.id)}
                                                        checked={selectedProductTypeIds.includes(productType.id)}
                                                    />
                                                    <label
                                                        className="form-check-label"
                                                        htmlFor={`productType-${productType.id}`}
                                                    >
                                                        {productType.name}
                                                    </label>
                                                </div>
                                            ))}
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
                                            <ProductCard
                                                key={model.id}
                                                model={model}
                                                token={token || ''}
                                                onWishlistChange={handleWishlistChange}
                                            />
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
