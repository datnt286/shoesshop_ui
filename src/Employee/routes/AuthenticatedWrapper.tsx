import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const AuthenticatedWrapper: React.FC = () => {
    const token = localStorage.getItem('employeeToken');
    const isAuthenticated = !!token;

    return isAuthenticated ? <Navigate to="/admin" /> : <Outlet />;
};

export default AuthenticatedWrapper;
