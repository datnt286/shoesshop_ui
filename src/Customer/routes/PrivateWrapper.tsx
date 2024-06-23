import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateWrapper: React.FC = () => {
    const token = localStorage.getItem('customerToken');
    const isAuthenticated = !!token;

    return isAuthenticated ? <Outlet /> : <Navigate to="/dang-nhap" />;
};

export default PrivateWrapper;
