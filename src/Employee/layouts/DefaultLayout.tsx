import React, { ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import Navbar from './../components/Navbar/index';
import Sidebar from './../components/Sidebar/index';
import Footer from './../components/Footer/index';
import Logo from '../resources/img/logo.jpg';

import '../resources/plugins/ionicons-2.0.1/css/ionicons.min.css';
import '../resources/plugins/fontawesome-free/css/all.min.css';
import '../resources/dist/css/adminlte.min.css';
import '../resources/css/style.css';

import '../resources/plugins/jquery-ui/jquery-ui.min.js';
import '../resources/plugins/bootstrap/js/bootstrap.bundle.min.js';
import '../resources/dist/js/adminlte.js';

interface User {
    exp?: number;
}

interface DefaultLayoutProps {
    children: ReactNode;
}

const DefaultLayout: React.FC<DefaultLayoutProps> = ({ children }) => {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('employeeToken');

        if (token) {
            try {
                const decodedToken: User = jwtDecode<User>(token);
                const currentTime = Date.now() / 1000;

                if (decodedToken.exp && decodedToken.exp < currentTime) {
                    console.log('Token đã hết hạn: ', token);
                    localStorage.removeItem('employeeToken');
                    navigate('/admin/dang-nhap');
                }
            } catch (error) {
                console.error('Token không hợp lệ: ', token);
                localStorage.removeItem('employeeToken');
                navigate('/admin/dang-nhap');
            }
        } else {
            navigate('/admin/dang-nhap');
        }
    }, [navigate]);

    useEffect(() => {
        const preloadDuration = 300;
        const preloader = document.querySelector('.preloader');

        if (preloader && preloader instanceof HTMLElement) {
            setTimeout(() => {
                preloader.style.height = '0';
                setTimeout(() => {
                    const children = preloader.children;
                    for (let i = 0; i < children.length; i++) {
                        const child = children[i];
                        if (child instanceof HTMLElement) {
                            child.style.display = 'none';
                        }
                    }
                }, 300);
            }, preloadDuration);
        }
    }, []);

    return (
        <>
            <div className="sidebar-mini layout-fixed">
                <div className="wrapper">
                    <div className="preloader flex-column justify-content-center align-items-center">
                        <img className="animation__shake" src={Logo} alt="Logo" height="60" width="60" />
                    </div>
                    <Navbar />
                    <Sidebar />
                    <div className="content-wrapper">
                        <section className="content">
                            <div className="container-fluid">
                                <div className="row">
                                    <div className="col-12">
                                        <main>{children}</main>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                    <Footer />
                </div>
            </div>
        </>
    );
};

export default DefaultLayout;
