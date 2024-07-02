import React from 'react';
import { Route, Routes } from 'react-router-dom';
import AuthenticatedWrapper from './AuthenticatedWrapper';
import PrivateWrapper from './PrivateWrapper';
import HomePage from '../pages/HomePage';
import LoginPage from './../pages/LoginPage';
import AccountPage from '../pages/AccountPage';
import ProductTypePage from './../pages/ProductTypePage';
import BrandPage from './../pages/BrandPage';
import ColorPage from '../pages/ColorPage';
import SizePage from './../pages/SizePage';
import SupplierPage from './../pages/SupplierPage';
import EmployeePage from './../pages/EmployeePage';
import CustomerPage from './../pages/CustomerPage';
import ShoesPage from './../pages/ShoesPage';
import AccessoriesPage from './../pages/AccessoriesPage';
import ProductPage from './../pages/ProductPage';
import InvoicePage from './../pages/InvoicePage';
import CommentPage from './../pages/CommentPage';
import ForgotPasswordPage from './../pages/ForgotPasswordPage';
import ForbiddenPage from './../pages/ForbiddenPage';
import NotFoundPage from './../pages/NotFoundPage';

const AppRoutes: React.FC = () => {
    return (
        <Routes>
            <Route element={<AuthenticatedWrapper />}>
                <Route path="/dang-nhap" element={<LoginPage />} />
                <Route path="/quen-mat-khau" element={<ForgotPasswordPage />} />
            </Route>

            <Route element={<PrivateWrapper />}>
                <Route path="/" element={<BrandPage />} />
                <Route path="/tai-khoan" element={<AccountPage />} />
                <Route path="/loai-san-pham" element={<ProductTypePage />} />
                <Route path="/nhan-hieu" element={<BrandPage />} />
                <Route path="/mau-sac" element={<ColorPage />} />
                <Route path="/size" element={<SizePage />} />
                <Route path="/nha-cung-cap" element={<SupplierPage />} />
                <Route path="/nhan-vien" element={<EmployeePage />} />
                <Route path="/khach-hang" element={<CustomerPage />} />
                <Route path="/giay" element={<ShoesPage />} />
                <Route path="/phu-kien" element={<AccessoriesPage />} />
                <Route path="/san-pham/:modelId" element={<ProductPage />} />
                <Route path="/hoa-don" element={<InvoicePage />} />
                <Route path="/binh-luan" element={<CommentPage />} />
            </Route>

            <Route path="/403" element={<ForbiddenPage />} />
            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    );
};

export default AppRoutes;
