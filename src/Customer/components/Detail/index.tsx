import React, { useEffect, useRef, useState } from 'react';
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
    price: number;
    description: string;
    images: Image[];
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

    const firstColorButtonRef = useRef<HTMLButtonElement>(null);
    const firstSizeButtonRef = useRef<HTMLButtonElement>(null);
    const { modelId } = useParams();
    const navigate = useNavigate();

    const imageSrc =
        model?.images && model.images.length > 0
            ? `${config.baseURL}/images/model/${model.images[0].name}`
            : DefaultImage;

    const productTypeName = productTypes.find((productType) => productType.id === model?.productTypeId)?.name || 'N/A';

    const fetchModel = async () => {
        try {
            const response = await AxiosInstance.get(`/Models/${modelId}`);

            if (response.status === 200) {
                setModel(response.data);
            }
        } catch (error) {
            console.error('Lỗi khi tải dữ liệu: ', error);
        }
    };

    const fetchProducts = async () => {
        try {
            const response = await AxiosInstance.get(`/Products/modelId/${modelId}`);

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
        if (firstColorButtonRef.current) {
            firstColorButtonRef.current.click();
        }
    }, [products]);

    useEffect(() => {
        if (firstSizeButtonRef.current) {
            firstSizeButtonRef.current.click();
        }
    }, [filteredProducts]);

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

    const handleAddtoCart = async () => {
        if (isLoggedIn && selectedProduct) {
            try {
                const data = {
                    userId: user.id,
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
                        confirmButtonText: 'OK',
                        confirmButtonColor: '#3085d6',
                    });
                }
            } catch (error) {
                console.error('Lỗi khi thêm sản phẩm vào giỏ hàng: ', error);

                Swal.fire({
                    title: 'Đã xảy ra lỗi khi thêm sản phẩm vào giỏ hàng!',
                    icon: 'error',
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#3085d6',
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

    const handleAddtoWishlist = async () => {
        if (isLoggedIn && selectedProduct) {
            try {
                const data = {
                    userId: user.id,
                    productId: selectedProduct?.id,
                };

                const response = await AxiosInstance.post('/Wishlists/AddToWishlist', data, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.status === 200) {
                    Swal.fire({
                        title: 'Đã thêm sản phẩm vào Wishlist!',
                        icon: 'success',
                        confirmButtonText: 'OK',
                        confirmButtonColor: '#3085d6',
                    });
                }
            } catch (error) {
                console.error('Lỗi khi thêm sản phẩm vào Wishlist: ', error);

                Swal.fire({
                    title: 'Đã xảy ra lỗi khi thêm sản phẩm vào Wishlist!',
                    icon: 'error',
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#3085d6',
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
                                    <h4 className="fw-bold mb-3">{selectedProduct?.name}</h4>
                                    <p className="mb-3">Phân loại: {productTypeName}</p>
                                    <h5 className="fw-bold mb-3">{selectedProduct?.price.toLocaleString() + ' ₫'}</h5>
                                    <div className="d-flex mb-4">
                                        <i className="fa fa-star text-secondary"></i>
                                        <i className="fa fa-star text-secondary"></i>
                                        <i className="fa fa-star text-secondary"></i>
                                        <i className="fa fa-star text-secondary"></i>
                                        <i className="fa fa-star"></i>
                                    </div>
                                    Màu sắc:
                                    <div className="mt-2 mb-4">
                                        {products
                                            .filter(
                                                (product, index, self) =>
                                                    index === self.findIndex((p) => p.colorId === product.colorId),
                                            )
                                            .map((product, index) => {
                                                const imageSrc = `${config.baseURL}/images/product/${product.image}`;
                                                const isFirst = index === 0;

                                                return (
                                                    <button
                                                        key={product.id}
                                                        className={`btn border py-1 px-1 mx-1 ${
                                                            activeColorId === product.colorId ? 'active' : ''
                                                        }`}
                                                        ref={isFirst ? firstColorButtonRef : null}
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
                                                                objectFit: 'cover',
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
                                        {filteredProducts.map((product, index) => (
                                            <button
                                                key={product.id}
                                                className={`btn border py-1 px-2 mx-1 mb-2 ${
                                                    activeSizeId === product.sizeId ? 'active' : ''
                                                }`}
                                                onClick={() => handleSizeButtonClick(product.id, product.sizeId)}
                                                ref={index === 0 ? firstSizeButtonRef : null}
                                            >
                                                {getSizeName(product.sizeId)}
                                            </button>
                                        ))}
                                    </div>
                                    <div className="input-group quantity mb-4" style={{ width: '100px' }}>
                                        <div className="input-group-btn">
                                            <button
                                                className="btn btn-sm btn-minus rounded-circle bg-light border"
                                                onClick={() => handleQuantityChange(quantity - 1)}
                                            >
                                                <i className="fa fa-minus"></i>
                                            </button>
                                        </div>
                                        <input
                                            type="text"
                                            className="form-control form-control-sm text-center border-0"
                                            value={quantity}
                                            onChange={(e) => handleQuantityChange(Number(e.target.value))} // Cập nhật số lượng khi giá trị input thay đổi
                                            min={1}
                                            pattern="[0-9]*"
                                        />
                                        <div className="input-group-btn">
                                            <button
                                                className="btn btn-sm btn-plus rounded-circle bg-light border"
                                                onClick={() => handleQuantityChange(quantity + 1)}
                                            >
                                                <i className="fa fa-plus"></i>
                                            </button>
                                        </div>
                                    </div>
                                    <div className="mb-5">Có sẵn: {selectedProduct?.quantity} đôi</div>
                                    <button
                                        className="btn border border-secondary rounded-pill px-4 py-2 mb-4 text-primary"
                                        onClick={handleAddtoCart}
                                    >
                                        <i className="fa fa-shopping-bag me-2"></i> Thêm vào giỏ hàng
                                    </button>
                                    <button
                                        className="btn border border-secondary rounded-pill px-4 py-2 mb-4 text-primary"
                                        onClick={handleAddtoWishlist}
                                    >
                                        <i className="far fa-heart me-2"></i> Thêm vào Wishlist
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
                    <ProductSlider />
                </div>
            </div>
        </>
    );
};

export default Detail;
