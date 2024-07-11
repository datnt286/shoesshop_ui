import React, { ReactNode, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import Header from './../components/Header';
import Footer from './../components/Footer';

import '../resources/lib/lightbox/css/lightbox.min.css';
import '../resources/lib/owlcarousel/assets/owl.carousel.min.css';
import '../resources/lib/fontawesome-5.15.4/css/all.css';
import '../resources/css/bootstrap.min.css';
import '../resources/css/style.css';
import '../resources/css/main.css';

import '../resources/js/jquery.min.js';
import '../resources/lib/easing/easing.min.js';
import '../resources/lib/waypoints/waypoints.min.js';
import '../resources/lib/lightbox/js/lightbox.min.js';
import '../resources/js/bootstrap.min.js';

interface User {
    exp?: number;
}

interface DefaultLayoutProps {
    children: ReactNode;
}

const DefaultLayout: React.FC<DefaultLayoutProps> = ({ children }) => {
    useEffect(() => {
        const token = localStorage.getItem('customerToken');

        if (token) {
            try {
                const decodedToken: User = jwtDecode<User>(token);
                const currentTime = Date.now() / 1000;

                if (decodedToken.exp && decodedToken.exp < currentTime) {
                    console.log('Token đã hết hạn: ', token);
                    localStorage.removeItem('customerToken');
                }
            } catch (error) {
                console.error('Token không hợp lệ: ', token);
                localStorage.removeItem('customerToken');
            }
        }
    }, []);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [children]);

    return (
        <>
            <Header />
            <main>{children}</main>
            <Footer />
        </>
    );
};

export default DefaultLayout;
