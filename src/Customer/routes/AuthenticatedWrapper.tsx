import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const AuthenticatedWrapper: React.FC = () => {
    const token = localStorage.getItem('customerToken');
    const isAuthenticated = !!token;

    return isAuthenticated ? <Navigate to="/" /> : <Outlet />;
};

export default AuthenticatedWrapper;
