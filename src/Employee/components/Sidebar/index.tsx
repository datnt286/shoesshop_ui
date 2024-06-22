import React, { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import config from '../../../services/config';
import DefaultAvatar from '../../resources/img/default-avatar.jpg';

interface User {
    userName: string;
    name?: string;
    avatar?: string;
}

const Sidebar: React.FC = () => {
    const [userData, setUserData] = useState({
        userName: '',
        name: '',
        avatar: '',
    });

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (token) {
            try {
                const decodedToken: User = jwtDecode<User>(token);

                setUserData({
                    userName: decodedToken.userName,
                    name: decodedToken.name || '',
                    avatar: decodedToken.avatar || '',
                });
            } catch (error) {
                console.error('Token không hợp lệ: ', token);
            }
        }
    }, []);

    const avatarSrc = userData.avatar ? `${config.baseURL}/images/avatar/${userData.avatar}` : DefaultAvatar;

    return (
        <aside className="main-sidebar sidebar-dark-primary elevation-4">
            <Link to="/" className="brand-link">
                <img src="" className="brand-image img-circle elevation-3" style={{ opacity: 0.8 }} alt="Logo" />
                <span className="brand-text font-weight-light">Double D Shop</span>
            </Link>
            <div className="sidebar">
                <div className="user-panel mt-3 pb-3 d-flex">
                    <div className="info">
                        <Link to="/tai-khoan" className="d-block">
                            <div className="image mr-1">
                                <img
                                    src={avatarSrc}
                                    className="img-circle elevation-2"
                                    style={{ width: '34px', height: '34px', objectFit: 'cover' }}
                                    alt="Ảnh đại diện"
                                />
                            </div>
                            {userData.name || userData.userName}
                        </Link>
                    </div>
                </div>
                <div className="form-inline">
                    <div className="input-group" data-widget="sidebar-search">
                        <input
                            type="search"
                            className="form-control form-control-sidebar"
                            placeholder="Tìm kiếm"
                            aria-label="Search"
                        />
                        <div className="input-group-append">
                            <button className="btn btn-sidebar">
                                <i className="fas fa-search fa-fw"></i>
                            </button>
                        </div>
                    </div>
                </div>
                <nav className="mt-2">
                    <ul
                        className="nav nav-pills nav-sidebar flex-column"
                        data-widget="treeview"
                        role="menu"
                        data-accordion="false"
                    >
                        <li className="nav-item">
                            <NavLink to="/" className="nav-link">
                                <i className="nav-icon fas fa-home"></i>
                                <p>Trang chủ</p>
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <a href="#" className="nav-link">
                                <i className="nav-icon fas fa-box-open"></i>
                                <p>
                                    Quản lý sản phẩm
                                    <i className="fas fa-angle-left right"></i>
                                </p>
                            </a>
                            <ul className="nav nav-treeview ml-2">
                                <li className="nav-item">
                                    <NavLink to="/giay" className="nav-link">
                                        <i className="nav-icon fas fa-shoe-prints"></i>
                                        <p>Giày</p>
                                    </NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink to="/phu-kien" className="nav-link">
                                        <i className="nav-icon fas fa-socks"></i>
                                        <p>Phụ kiện</p>
                                    </NavLink>
                                </li>
                            </ul>
                        </li>
                        <li className="nav-item">
                            <NavLink to="/nhan-hieu" className="nav-link">
                                <i className="nav-icon fas fa-tag"></i>
                                <p>Quản lý nhãn hiệu</p>
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink to="/mau-sac" className="nav-link">
                                <i className="nav-icon fas fa-palette"></i>
                                <p>Quản lý màu sắc</p>
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink to="/size" className="nav-link">
                                <i className="nav-icon fas fa-tshirt"></i>
                                <p>Quản lý size</p>
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink to="/nha-cung-cap" className="nav-link">
                                <i className="nav-icon fas fa-shipping-fast"></i>
                                <p>Quản lý nhà cung cấp</p>
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink to="/nhan-vien" className="nav-link">
                                <i className="nav-icon fas fa-user-tie"></i>
                                <p>Quản lý nhân viên</p>
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink to="/khach-hang" className="nav-link">
                                <i className="nav-icon fas fa-users"></i>
                                <p>Quản lý khách hàng</p>
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink to="/hoa-don" className="nav-link">
                                <i className="nav-icon fas fa-scroll"></i>
                                <p>Quản lý hoá đơn</p>
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink to="/hoa-don-nhap" className="nav-link">
                                <i className="nav-icon fas fa-clipboard"></i>
                                <p>Quản lý hoá đơn nhập</p>
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink to="/binh-luan" className="nav-link">
                                <i className="nav-icon fas fa-comments"></i>
                                <p>Quản lý bình luận</p>
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink to="/slider" className="nav-link">
                                <i className="nav-icon fab fa-adversal"></i>
                                <p>Quản lý slider</p>
                            </NavLink>
                        </li>
                    </ul>
                </nav>
            </div>
        </aside>
    );
};

export default Sidebar;
