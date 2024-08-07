import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import Swal from 'sweetalert2';
import AxiosInstance from '../../../services/AxiosInstance';
import HelmetInstance from '../../../utils/HelmetInstance';
import config from '../../../services/config';
import ProductTab from './ProductTab';
import ProductSection from '../ProductSection/index';
import ProductSlider from './../ProductSlider/index';
import DefaultImage from '../../resources/img/default-image.jpg';

interface Model {
    id: number;
    name: string;
    productTypeId: number;
    brandId: number;
    price: number;
    description: string;
    images: Image[];
    averageRating: number;
    totalReviews: number;
    isBought: boolean;
}

interface Image {
    id: number;
    name: string;
}

interface Product {
    id: number;
    name: string;
    colorId: number;
    sizeId: number;
    price: number;
    quantity: number;
    image: string;
    isInWishlist: boolean;
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

interface User {
    id: string;
    userName: string;
    name?: string;
    avatar?: string;
}

const Detail: React.FC = () => {
    const [model, setModel] = useState<Model | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [productTypes, setProductTypes] = useState<ProductType[]>([]);
    const [colors, setColors] = useState<Color[]>([]);
    const [sizes, setSizes] = useState<Size[]>([]);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [quantity, setQuantity] = useState(1);
    const [amount, setAmount] = useState(selectedProduct?.price);
    const [activeColorId, setActiveColorId] = useState<number | null>(null);
    const [activeSizeId, setActiveSizeId] = useState<number | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState<User>({
        id: '',
        userName: '',
        name: '',
        avatar: '',
    });

    const { modelId } = useParams();
    const navigate = useNavigate();

    const imageSrc =
        model?.images && model.images.length > 0
            ? `${config.baseURL}/images/model/${model.images[0].name}`
            : DefaultImage;

    const productTypeName = productTypes.find((productType) => productType.id === model?.productTypeId)?.name || 'N/A';

    const fetchModel = async () => {
        try {
            const response = await AxiosInstance.get(`/Models/${modelId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.status === 200) {
                setModel(response.data);
            }
        } catch (error) {
            console.error('Lỗi khi tải dữ liệu: ', error);
        }
    };

    const fetchProducts = async () => {
        try {
            const response = await AxiosInstance.get(`/Products/Model/${modelId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.status === 200) {
                setProducts(response.data);
            }
        } catch (error) {
            console.error('Lỗi khi tải dữ liệu: ', error);
        }
    };

    const fetchProductTypes = async () => {
        try {
            const response = await AxiosInstance.get('/ProductTypes');

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
        fetchModel();
        fetchProducts();
        fetchProductTypes();
        fetchColors();
        fetchSizes();
    }, []);

    useEffect(() => {
        if (token) {
            fetchModel();
            fetchProducts();
        }
    }, [token]);

    useEffect(() => {
        if (selectedProduct) {
            setAmount(selectedProduct.price * quantity);
        }
    }, [selectedProduct, quantity]);

    useEffect(() => {
        const token = localStorage.getItem('customerToken');

        if (token) {
            try {
                const decodedToken: User = jwtDecode<User>(token);

                setIsLoggedIn(true);
                setToken(token);
                setUser({
                    id: decodedToken.id,
                    userName: decodedToken.userName,
                    name: decodedToken.name || '',
                    avatar: decodedToken.avatar || '',
                });
            } catch (error) {
                console.error('Token không hợp lệ: ', token);
            }
        } else {
            setIsLoggedIn(false);
        }
    }, []);

    const getColorName = (colorId: number) => {
        const color = colors.find((color) => color.id === colorId);
        return color ? color.name : 'Lỗi màu sắc';
    };

    const getSizeName = (sizeId: number) => {
        const size = sizes.find((size) => size.id === sizeId);
        return size ? size.name : 'Lỗi size';
    };

    const handleColorButtonClick = (colorId: number, imageSrc: string) => {
        setSelectedProduct(null);
        setSelectedImage(imageSrc);
        setActiveColorId(colorId);
        const filtered = products.filter((product) => product.colorId === colorId);
        setFilteredProducts(filtered);
        setActiveSizeId(null);
        setQuantity(1);
    };

    const handleSizeButtonClick = (productId: number, sizeId: number) => {
        const selectedProduct = filteredProducts.find((product) => product.id === productId);

        if (selectedProduct) {
            setSelectedProduct(selectedProduct);
            setActiveSizeId(sizeId);
            setQuantity(1);
        }
    };

    const handleQuantityChange = (newQuantity: number) => {
        if (newQuantity >= 1 && (!selectedProduct || newQuantity <= selectedProduct.quantity)) {
            setQuantity(newQuantity);
        }
    };

    const handleAddToCart = async () => {
        if (isLoggedIn && selectedProduct) {
            try {
                const data = {
                    productId: selectedProduct?.id,
                    price: selectedProduct?.price,
                    quantity: quantity,
                    amount: amount,
                };

                const response = await AxiosInstance.post('/Carts/AddToCart', data, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.status === 200) {
                    Swal.fire({
                        title: 'Đã thêm sản phẩm vào giỏ hàng!',
                        icon: 'success',
                        toast: true,
                        position: 'top-end',
                        timerProgressBar: true,
                        showConfirmButton: false,
                        timer: 1000,
                    });
                }
            } catch (error) {
                console.error('Lỗi khi thêm sản phẩm vào giỏ hàng: ', error);

                Swal.fire({
                    title: 'Đã xảy ra lỗi khi thêm sản phẩm vào giỏ hàng!',
                    icon: 'error',
                    toast: true,
                    position: 'top-end',
                    timerProgressBar: true,
                    showConfirmButton: false,
                    timer: 3000,
                });
            }
        } else {
            const result = await Swal.fire({
                title: 'Bạn chưa đăng nhập tài khoản!',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Chuyển đến trang đăng nhập',
                confirmButtonColor: '#3085d6',
                cancelButtonText: 'Huỷ',
            });

            if (result.isConfirmed) {
                navigate('/dang-nhap');
            }
        }
    };

    const handleAddToWishlist = async () => {
        if (isLoggedIn && selectedProduct) {
            if (!selectedProduct.isInWishlist) {
                try {
                    const response = await AxiosInstance.post(
                        `/Wishlists/AddToWishlist/${selectedProduct?.id}`,
                        {},
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        },
                    );

                    if (response.status === 200) {
                        Swal.fire({
                            title: 'Đã thêm sản phẩm vào Wishlist!',
                            icon: 'success',
                            toast: true,
                            position: 'top-end',
                            timerProgressBar: true,
                            showConfirmButton: false,
                            timer: 1000,
                        });

                        const updatedProducts = products.map((product) =>
                            product.id === selectedProduct.id ? { ...product, isInWishlist: true } : product,
                        );

                        setProducts(updatedProducts);
                    }
                } catch (error) {
                    console.error('Lỗi khi thêm sản phẩm vào Wishlist: ', error);

                    Swal.fire({
                        title: 'Đã xảy ra lỗi khi thêm sản phẩm vào Wishlist!',
                        icon: 'error',
                        toast: true,
                        position: 'top-end',
                        timerProgressBar: true,
                        showConfirmButton: false,
                        timer: 3000,
                    });
                }
            } else {
                try {
                    const response = await AxiosInstance.delete(
                        `/Wishlists/DeleteWishlistDetailByProductId/${selectedProduct.id}`,
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        },
                    );

                    if (response.status === 204) {
                        Swal.fire({
                            title: 'Đã xoá sản phẩm khỏi Wishlist!',
                            icon: 'success',
                            toast: true,
                            position: 'top-end',
                            timerProgressBar: true,
                            showConfirmButton: false,
                            timer: 1000,
                        });

                        const updatedProducts = products.map((product) =>
                            product.id === selectedProduct.id ? { ...product, isInWishlist: false } : product,
                        );
                        setProducts(updatedProducts);
                    }
                } catch (error) {
                    console.error('Lỗi khi xoá sản phẩm khỏi Wishlist: ', error);

                    Swal.fire({
                        title: 'Đã xảy ra lỗi khi xoá sản phẩm khỏi Wishlist!',
                        icon: 'error',
                        toast: true,
                        position: 'top-end',
                        timerProgressBar: true,
                        showConfirmButton: false,
                        timer: 3000,
                    });
                }
            }
        } else {
            const result = await Swal.fire({
                title: 'Bạn chưa đăng nhập tài khoản!',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Chuyển đến trang đăng nhập',
                confirmButtonColor: '#3085d6',
                cancelButtonText: 'Huỷ',
            });

            if (result.isConfirmed) {
                navigate('/dang-nhap');
            }
        }
    };

    const handleBuyNow = () => {
        handleAddToCart();
        navigate('/thanh-toan');
    };

    return (
        <>
            <HelmetInstance title={model?.name || 'Sản phẩm'} />
            <div className="container-fluid py-5 mt-5">
                <div className="container py-5">
                    <div className="row g-4 mb-5">
                        <div className="col-lg-8 col-xl-9">
                            <div className="row g-4">
                                <div className="col-lg-6">
                                    <div className="border rounded">
                                        <img
                                            src={selectedImage || imageSrc}
                                            className="img-fluid rounded"
                                            alt="Ảnh sản phẩm"
                                        />
                                    </div>
                                    <div className="border border-2 rounded p-1 mt-3">
                                        {model?.images.map((image, index) => {
                                            const imageSrc = `${config.baseURL}/images/model/${image.name}`;

                                            return (
                                                <img
                                                    key={index}
                                                    src={imageSrc}
                                                    className="img-fluid border border-1 rounded m-1"
                                                    style={{ width: '80px', cursor: 'pointer' }}
                                                    onClick={() => setSelectedImage(imageSrc)}
                                                    alt="Ảnh sản phẩm"
                                                />
                                            );
                                        })}
                                    </div>
                                </div>
                                <div className="col-lg-6">
                                    <h4 className="fw-bold mb-3">{selectedProduct?.name || model?.name}</h4>
                                    <p className="mb-3">Phân loại: {productTypeName}</p>
                                    <h5 className="fw-bold mb-3">
                                        {(selectedProduct?.price || model?.price)?.toLocaleString() + ' ₫'}
                                    </h5>
                                    <div className="d-flex mb-4">
                                        {[...Array(5)].map((_, index) => (
                                            <i
                                                key={index}
                                                className={`fa fa-star ${
                                                    index < (model?.averageRating ?? 0) ? 'text-secondary' : ''
                                                }`}
                                            ></i>
                                        ))}
                                        <span className="ml-2" style={{ lineHeight: '17px' }}>
                                            {model?.averageRating.toFixed(1)} ({model?.totalReviews} đánh giá)
                                        </span>
                                    </div>
                                    Màu sắc:
                                    <div className="mt-2 mb-4">
                                        {products
                                            .filter(
                                                (product, index, self) =>
                                                    index === self.findIndex((p) => p.colorId === product.colorId),
                                            )
                                            .map((product) => {
                                                const imageSrc = `${config.baseURL}/images/product/${product.image}`;

                                                return (
                                                    <button
                                                        key={product.id}
                                                        className={`btn border py-1 px-1 mx-1 mb-2 ${
                                                            activeColorId === product.colorId ? 'active' : ''
                                                        }`}
                                                        onClick={() =>
                                                            handleColorButtonClick(product.colorId, imageSrc)
                                                        }
                                                    >
                                                        <img
                                                            src={imageSrc}
                                                            className="img-fluid rounded"
                                                            style={{
                                                                width: '30px',
                                                                height: '25px',
                                                            }}
                                                            alt="Ảnh sản phẩm"
                                                        />{' '}
                                                        {getColorName(product.colorId)}
                                                    </button>
                                                );
                                            })}
                                    </div>
                                    <div className="mt-2 mb-4">
                                        Size:{' '}
                                        {filteredProducts.length > 0 ? (
                                            filteredProducts.map((product) => (
                                                <button
                                                    key={product.id}
                                                    className={`btn border py-1 px-2 mx-1 mb-2 ${
                                                        activeSizeId === product.sizeId ? 'active' : ''
                                                    }`}
                                                    onClick={() => handleSizeButtonClick(product.id, product.sizeId)}
                                                >
                                                    {getSizeName(product.sizeId)}
                                                </button>
                                            ))
                                        ) : (
                                            <span>Vui lòng chọn màu sắc.</span>
                                        )}
                                    </div>
                                    <div className="input-group quantity d-flex mb-4" style={{ width: '100px' }}>
                                        <div className="input-group-btn">
                                            <button
                                                className="btn btn-sm btn-minus rounded-circle bg-light border"
                                                onClick={() => handleQuantityChange(quantity - 1)}
                                                disabled={!selectedProduct}
                                            >
                                                <i className="fa fa-minus"></i>
                                            </button>
                                        </div>
                                        <input
                                            type="text"
                                            className="form-control form-control-sm text-center border-0"
                                            value={quantity}
                                            onChange={(e) => handleQuantityChange(Number(e.target.value))}
                                            min={1}
                                            pattern="[0-9]*"
                                            disabled={!selectedProduct}
                                        />
                                        <div className="input-group-btn">
                                            <button
                                                className="btn btn-sm btn-plus rounded-circle bg-light border"
                                                onClick={() => handleQuantityChange(quantity + 1)}
                                                disabled={!selectedProduct}
                                            >
                                                <i className="fa fa-plus"></i>
                                            </button>
                                        </div>
                                    </div>
                                    <div className="mb-5">
                                        {selectedProduct
                                            ? `Có sẵn: ${selectedProduct.quantity} đôi`
                                            : 'Vui lòng chọn màu và size.'}
                                    </div>
                                    <div>
                                        <button
                                            className="btn border border-secondary rounded-pill px-4 py-2 mb-4 text-primary"
                                            onClick={handleAddToCart}
                                            disabled={(selectedProduct?.quantity ?? 0) < 1}
                                        >
                                            <i className="fa fa-shopping-bag me-2"></i> Thêm vào giỏ hàng
                                        </button>
                                        <button
                                            className={`btn border border-secondary rounded-pill px-3 py-2 ml-3 mb-4 ${
                                                selectedProduct?.isInWishlist ? 'text-danger' : 'text-primary'
                                            }`}
                                            onClick={handleAddToWishlist}
                                            disabled={!selectedProduct}
                                        >
                                            <i
                                                className={`${selectedProduct?.isInWishlist ? 'fas' : 'far'} fa-heart`}
                                            ></i>
                                        </button>
                                    </div>
                                    <button
                                        className="btn border border-secondary rounded-pill px-4 py-2 mb-4 text-primary"
                                        onClick={handleBuyNow}
                                        disabled={(selectedProduct?.quantity ?? 0) < 1}
                                    >
                                        <i className="fas fa-money-check-alt me-2"></i> Mua ngay
                                    </button>
                                </div>
                                <ProductTab token={token} model={model} user={user} />
                            </div>
                        </div>
                        <div className="col-lg-4 col-xl-3">
                            <div className="row g-4 fruite">
                                <ProductSection />
                            </div>
                        </div>
                    </div>
                    {model?.brandId !== undefined && (
                        <ProductSlider endpoint={`/Models/BrandId/${model.brandId}`} title="Sản phẩm liên quan" />
                    )}
                </div>
            </div>
        </>
    );
};

export default Detail;
