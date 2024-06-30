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

    const avatarSrc = userData.avatar ? `${config.baseURL}/images/avatar/${userData.avatar}` : DefaultAvatar;

    useEffect(() => {
        const token = localStorage.getItem('employeeToken');

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

    return (
        <aside className="main-sidebar sidebar-dark-primary elevation-4">
            <Link to="/admin" className="brand-link">
                <img src="" className="brand-image img-circle elevation-3" style={{ opacity: 0.8 }} alt="Logo" />
                <span className="brand-text font-weight-light">Double D Shop</span>
            </Link>
            <div className="sidebar">
                <div className="user-panel mt-3 pb-3 d-flex">
                    <div className="info">
                        <Link to="/admin/tai-khoan" className="d-block">
                            <div className="image">
                                <img
                                    src={avatarSrc}
                                    className="img-circle elevation-2"
                                    style={{ width: '34px', height: '34px', objectFit: 'cover' }}
                                    alt="Ảnh đại diện"
                                />
                            </div>{' '}
                            {userData.name || userData.userName}
                        </Link>
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
                            <NavLink to="/admin" className="nav-link">
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
                                    <NavLink to="/admin/giay" className="nav-link">
                                        <i className="nav-icon fas fa-shoe-prints"></i>
                                        <p>Giày</p>
                                    </NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink to="/admin/phu-kien" className="nav-link">
                                        <i className="nav-icon fas fa-socks"></i>
                                        <p>Phụ kiện</p>
                                    </NavLink>
                                </li>
                            </ul>
                        </li>
                        <li className="nav-item">
                            <NavLink to="/admin/loai-san-pham" className="nav-link">
                                <i className="nav-icon fas fa-tag"></i>
                                <p>Quản lý loại sản phẩm</p>
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink to="/admin/nhan-hieu" className="nav-link">
                                <i className="nav-icon far fa-flag"></i>
                                <p>Quản lý nhãn hiệu</p>
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink to="/admin/mau-sac" className="nav-link">
                                <i className="nav-icon fas fa-palette"></i>
                                <p>Quản lý màu sắc</p>
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink to="/admin/size" className="nav-link">
                                <i className="nav-icon fas fa-tshirt"></i>
                                <p>Quản lý size</p>
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink to="/admin/nha-cung-cap" className="nav-link">
                                <i className="nav-icon fas fa-shipping-fast"></i>
                                <p>Quản lý nhà cung cấp</p>
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink to="/admin/nhan-vien" className="nav-link">
                                <i className="nav-icon fas fa-user-tie"></i>
                                <p>Quản lý nhân viên</p>
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink to="/admin/khach-hang" className="nav-link">
                                <i className="nav-icon fas fa-users"></i>
                                <p>Quản lý khách hàng</p>
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink to="/admin/hoa-don" className="nav-link">
                                <i className="nav-icon fas fa-scroll"></i>
                                <p>Quản lý hoá đơn</p>
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink to="/admin/binh-luan" className="nav-link">
                                <i className="nav-icon fas fa-comments"></i>
                                <p>Quản lý bình luận</p>
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink to="/admin/slider" className="nav-link">
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
