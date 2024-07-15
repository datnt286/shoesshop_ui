import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

interface User {
    role?: string;
}

const AdminRedirectWrapper: React.FC = () => {
    const [role, setRole] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const token = localStorage.getItem('employeeToken');

    useEffect(() => {
        if (token) {
            try {
                const decodedToken: User = jwtDecode<User>(token);
                setRole(decodedToken.role || '');
            } catch (error) {
                console.error('Token không hợp lệ: ', token);
            }
        }
        setIsLoading(false);
    }, [token]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (role === 'Shipper' || role === 'SalesStaff') {
        return <Navigate to="/admin/hoa-don" />;
    } else if (role === 'WarehouseStaff') {
        return <Navigate to="/admin/giay" />;
    } else if (!role || role === '') {
        return <Navigate to="/admin/403" />;
    }

    return <Outlet />;
};

export default AdminRedirectWrapper;
