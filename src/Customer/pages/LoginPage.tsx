import React from 'react';
import HelmetInstance from '../../utils/HelmetInstance';
import DefaultLayout from '../layouts/DefaultLayout';
import PageHeader from '../components/PageHeader/index';
import Login from './../components/Login/index';

const LoginPage: React.FC = () => {
    return (
        <DefaultLayout>
            <HelmetInstance title="Đăng nhập" />
            <PageHeader title="Đăng Nhập" />
            <Login />
        </DefaultLayout>
    );
};

export default LoginPage;
