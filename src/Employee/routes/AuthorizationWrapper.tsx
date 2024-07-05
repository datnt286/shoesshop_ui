import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

interface User {
    role?: string;
}

interface AuthorizationWrapperProps {
    allowedRoles: string[];
}

const AuthorizationWrapper: React.FC<AuthorizationWrapperProps> = ({ allowedRoles }) => {
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

    const isAuthorized = role && allowedRoles.includes(role);

    return isAuthorized ? <Outlet /> : <Navigate to="/admin/403" />;
};

export default AuthorizationWrapper;
