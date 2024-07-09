import React, { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import Swal from 'sweetalert2';
import AxiosInstance from '../../../services/AxiosInstance';
import config from '../../../services/config';
import Logo from '../../resources/img/logo.jpg';

interface ProductType {
    id: number;
    name: string;
}

interface User {
    avatar?: string;
}

const Header: React.FC = () => {
    const [token, setToken] = useState<string | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [avatar, setAvatar] = useState('');
    const [productTypes, setProductTypes] = useState<ProductType[]>([]);
    const [cartCount, setCartCount] = useState(0);
    const [wishlistCount, setWishlistCount] = useState(0);
    const [keyword, setKeyword] = useState('');
    const [validationError, setValidationError] = useState('');
    const closeButtonRef = useRef<HTMLButtonElement>(null);
    const navigate = useNavigate();

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

    const fetchCountCartAndWishlist = async () => {
        try {
            const response = await AxiosInstance.get('/Users/CountCartAndWishlist', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.status === 200) {
                setCartCount(response.data.cartDetailsCount);
                setWishlistCount(response.data.wishlistDetailsCount);
            }
        } catch (error) {
            console.error('Lỗi khi tải dữ liệu: ', error);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('customerToken');

        if (token) {
            try {
                const decodedToken: User = jwtDecode<User>(token);

                setToken(token);
                setIsLoggedIn(true);
                setAvatar(decodedToken.avatar || '');
            } catch (error) {
                console.error('Token không hợp lệ: ', token);
            }
        } else {
            setIsLoggedIn(false);
        }
    }, []);

    useEffect(() => {
        fetchProductTypes();
    }, []);

    useEffect(() => {
        if (token) {
            fetchCountCartAndWishlist();
        }
    }, [token]);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setKeyword(event.target.value);
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!keyword) {
            setValidationError('Vui lòng nhập từ khoá!');
            return;
        }

        closeButtonRef.current?.click();
        navigate(`/tim-kiem/${keyword}`);
    };

    const handleLogout = async () => {
        const result = await Swal.fire({
            title: 'Bạn có chắc muốn đăng xuất?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Đăng xuất',
            confirmButtonColor: '#d33',
            cancelButtonText: 'Huỷ',
        });

        if (result.isConfirmed) {
            localStorage.removeItem('customerToken');
            setIsLoggedIn(false);
            setAvatar('');
            navigate('/');
        }
    };

    return (
        <>
            <div className="container-fluid fixed-top">
                <div className="container topbar bg-primary d-none d-lg-block">
                    <div className="d-flex justify-content-between">
                        <div className="top-info ps-2">
                            <small className="me-3">
                                <i className="fas fa-map-marker-alt me-2 text-secondary"></i>{' '}
                                <Link to="/lien-he" className="text-white">
                                    123 TP. Hồ Chí Minh
                                </Link>
                            </small>
                            <small className="me-3">
                                <i className="fas fa-envelope me-2 text-secondary"></i>
                                <Link to="/lien-he" className="text-white">
                                    doube.d.shop@gmail.com
                                </Link>
                            </small>
                        </div>
                        <div className="top-link pe-2">
                            <a href="#" className="text-white">
                                <small className="text-white mx-2">Chính sách bảo mật</small>/
                            </a>
                            <a href="#" className="text-white">
                                <small className="text-white mx-2">Điều khoản sử dụng</small>/
                            </a>
                            <a href="#" className="text-white">
                                <small className="text-white ms-2">Bán hàng và hoàn tiền</small>
                            </a>
                        </div>
                    </div>
                </div>
                <div className="container px-0">
                    <nav className="navbar navbar-light bg-white navbar-expand-xl">
                        <Link to="/" className="navbar-brand d-flex">
                            <img
                                src={Logo}
                                className="img-fluid me-1"
                                style={{ width: '46px', height: '46px' }}
                                alt="Logo"
                            />
                            <h1 className="text-primary display-6">Double D</h1>
                        </Link>
                        <button
                            className="navbar-toggler py-2 px-3"
                            data-bs-toggle="collapse"
                            data-bs-target="#navbarCollapse"
                        >
                            <span className="fa fa-bars text-primary"></span>
                        </button>
                        <div className="collapse navbar-collapse bg-white" id="navbarCollapse">
                            <div className="navbar-nav mx-auto">
                                <NavLink to="/" className="nav-item nav-link">
                                    Trang chủ
                                </NavLink>
                                <div className="nav-item dropdown">
                                    <span
                                        className="nav-link dropdown-toggle"
                                        id="dropdownNavbarMenu"
                                        style={{ cursor: 'pointer' }}
                                        data-bs-toggle="dropdown"
                                    >
                                        Danh mục
                                    </span>
                                    <ul
                                        className="dropdown-menu m-0 bg-secondary rounded-0"
                                        aria-labelledby="dropdownNavbarMenu"
                                    >
                                        {productTypes.map((productType) => (
                                            <li key={productType.id}>
                                                <NavLink to={`/danh-muc/${productType.id}`} className="dropdown-item">
                                                    {productType.name}
                                                </NavLink>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <NavLink to="/cua-hang" className="nav-item nav-link">
                                    Cửa hàng
                                </NavLink>
                                <NavLink to="/lien-he" className="nav-item nav-link">
                                    Liên hệ
                                </NavLink>
                            </div>
                            <div className="d-flex m-3 me-0">
                                <button
                                    className="btn-search btn border border-secondary btn-md-square rounded-circle bg-white me-4"
                                    data-bs-toggle="modal"
                                    data-bs-target="#searchModal"
                                >
                                    <i className="fas fa-search text-primary"></i>
                                </button>
                                <Link to="/wishlist" className="position-relative me-4 my-auto">
                                    <i className="fas fa-heart fa-2x"></i>
                                    {isLoggedIn && (
                                        <span
                                            className="position-absolute bg-secondary rounded-circle d-flex align-items-center justify-content-center text-dark px-1"
                                            style={{ top: '-5px', left: '15px', height: '20px', minWidth: '20px' }}
                                        >
                                            {wishlistCount}
                                        </span>
                                    )}
                                </Link>
                                <Link to="/gio-hang" className="position-relative me-4 my-auto">
                                    <i className="fa fa-shopping-bag fa-2x"></i>
                                    {isLoggedIn && (
                                        <span
                                            className="position-absolute bg-secondary rounded-circle d-flex align-items-center justify-content-center text-dark px-1"
                                            style={{ top: '-5px', left: '15px', height: '20px', minWidth: '20px' }}
                                        >
                                            {cartCount}
                                        </span>
                                    )}
                                </Link>
                                {isLoggedIn ? (
                                    <div className="nav-item dropdown position-relative me-4 my-auto">
                                        <div
                                            className="text-primary"
                                            id="dropdownAccountMenu"
                                            data-bs-toggle="dropdown"
                                            aria-expanded="false"
                                            style={{ cursor: 'pointer', padding: '.5rem 0' }}
                                        >
                                            {avatar ? (
                                                <img
                                                    src={`${config.baseURL}/images/avatar/${avatar}`}
                                                    className="rounded-circle"
                                                    style={{ width: '40px', height: '40px' }}
                                                    alt="Ảnh đại diện"
                                                />
                                            ) : (
                                                <i className="fas fa-user fa-2x"></i>
                                            )}
                                        </div>
                                        <ul
                                            className="dropdown-menu m-0 bg-secondary rounded-0 position-absolute"
                                            style={{ left: '-120px' }}
                                            aria-labelledby="dropdownAccountMenu"
                                        >
                                            <li>
                                                <NavLink to="/tai-khoan" className="dropdown-item">
                                                    Tài khoản
                                                </NavLink>
                                            </li>
                                            <li>
                                                <NavLink to="/doi-mat-khau" className="dropdown-item">
                                                    Đổi mật khẩu
                                                </NavLink>
                                            </li>
                                            <li>
                                                <NavLink to="/hoa-don" className="dropdown-item">
                                                    Hoá đơn
                                                </NavLink>
                                            </li>
                                            <li>
                                                <button className="dropdown-item" onClick={handleLogout}>
                                                    Đăng xuất
                                                </button>
                                            </li>
                                        </ul>
                                    </div>
                                ) : (
                                    <div className="navbar-nav">
                                        <NavLink to="/dang-nhap" className="nav-item nav-link">
                                            Đăng nhập
                                        </NavLink>
                                        <NavLink to="/dang-ky" className="nav-item nav-link">
                                            Đăng ký
                                        </NavLink>
                                    </div>
                                )}
                            </div>
                        </div>
                    </nav>
                </div>
            </div>

            <div className="modal fade" id="searchModal" tabIndex={-1} aria-labelledby="modalLabel" aria-hidden="true">
                <div className="modal-dialog modal-fullscreen">
                    <div className="modal-content rounded-0">
                        <div className="modal-header">
                            <h5 className="modal-title" id="modalLabel">
                                Tìm kiếm sản phẩm
                            </h5>
                            <button
                                type="button"
                                className="btn-close"
                                ref={closeButtonRef}
                                data-bs-dismiss="modal"
                                aria-label="Close"
                            ></button>
                        </div>
                        <div className="modal-body d-flex align-items-center">
                            <form className="w-100" onSubmit={handleSubmit}>
                                <div className="input-group w-75 mx-auto d-flex">
                                    <input
                                        type="search"
                                        className="form-control p-3"
                                        aria-describedby="search-icon"
                                        onChange={handleInputChange}
                                        placeholder={validationError ? validationError : 'Nhập từ khoá'}
                                    />
                                    <button type="submit" id="search-icon" className="input-group-text p-3">
                                        <i className="fa fa-search"></i>
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Header;
