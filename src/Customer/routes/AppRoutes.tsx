import React from 'react';
import { Route, Routes } from 'react-router-dom';
import AuthenticatedWrapper from './AuthenticatedWrapper';
import PrivateWrapper from './PrivateWrapper';
import HomePage from '../pages/HomePage';
import ShopPage from '../pages/ShopPage';
import SearchPage from './../pages/SearchPage';
import ProductTypePage from './../pages/ProductTypePage';
import DetailPage from './../pages/DetailPage';
import CartPage from './../pages/CartPage';
import CheckoutPage from './../pages/CheckoutPage';
import WishlistPage from './../pages/WishlistPage';
import RegisterPage from './../pages/RegisterPage';
import LoginPage from './../pages/LoginPage';
import AccountPage from '../pages/AccountPage';
import ChangePasswordPage from './../pages/ChangePasswordPage';
import InvoicePage from './../pages/InvoicePage';
import ForgotPasswordPage from './../pages/ForgotPasswordPage';
import ContactPage from './../pages/ContactPage';
import NotFoundPage from '../pages/NotFoundPage';
import VnpayReturn from './../components/Checkout/VnpayReturn';
import MomoReturn from './../components/Checkout/MomoReturn';

const AppRoutes: React.FC = () => {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/cua-hang" element={<ShopPage />} />
            <Route path="/tim-kiem/:keyword" element={<SearchPage />} />
            <Route path="/danh-muc/:productType" element={<ProductTypePage />} />
            <Route path="/san-pham/:modelId" element={<DetailPage />} />
            <Route path="/dang-ky" element={<RegisterPage />} />
            <Route path="/lien-he" element={<ContactPage />} />

            <Route element={<AuthenticatedWrapper />}>
                <Route path="/dang-nhap" element={<LoginPage />} />
                <Route path="/quen-mat-khau" element={<ForgotPasswordPage />} />
            </Route>

            <Route element={<PrivateWrapper />}>
                <Route path="/tai-khoan" element={<AccountPage />} />
                <Route path="/doi-mat-khau" element={<ChangePasswordPage />} />
                <Route path="/gio-hang" element={<CartPage />} />
                <Route path="/wishlist" element={<WishlistPage />} />
                <Route path="/thanh-toan" element={<CheckoutPage />} />
                <Route path="/hoa-don" element={<InvoicePage />} />
                <Route path="/vnpay-return" element={<VnpayReturn />} />
                <Route path="/momo-return" element={<MomoReturn />} />
            </Route>

            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    );
};

export default AppRoutes;
