import React from 'react';
import { Route, Routes } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import ShopPage from '../pages/ShopPage';
import SearchPage from './../pages/SearchPage';
import DetailPage from './../pages/DetailPage';
import CartPage from './../pages/CartPage';
import CheckoutPage from './../pages/CheckoutPage';
import WishlistPage from './../pages/WishlistPage';
import RegisterPage from './../pages/RegisterPage';
import LoginPage from './../pages/LoginPage';
import AccountPage from '../pages/AccountPage';
import ChangePasswordPage from './../pages/ChangePasswordPage';
import InvoicePage from './../pages/InvoicePage';
import ContactPage from './../pages/ContactPage';
import NotFoundPage from '../pages/NotFoundPage';

const AppRoutes: React.FC = () => {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/cua-hang" element={<ShopPage />} />
            <Route path="/tim-kiem/:keyword" element={<SearchPage />} />
            <Route path="/san-pham/:modelId" element={<DetailPage />} />
            <Route path="/gio-hang" element={<CartPage />} />
            <Route path="/thanh-toan" element={<CheckoutPage />} />
            <Route path="/wishlist" element={<WishlistPage />} />
            <Route path="/dang-ky" element={<RegisterPage />} />
            <Route path="/dang-nhap" element={<LoginPage />} />
            <Route path="/tai-khoan" element={<AccountPage />} />
            <Route path="/doi-mat-khau" element={<ChangePasswordPage />} />
            <Route path="/hoa-don" element={<InvoicePage />} />
            <Route path="/lien-he" element={<ContactPage />} />
            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    );
};

export default AppRoutes;
