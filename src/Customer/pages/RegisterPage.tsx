import React from 'react';
import HelmetInstance from '../../utils/HelmetInstance';
import DefaultLayout from '../layouts/DefaultLayout';
import PageHeader from '../components/PageHeader/index';
import Register from './../components/Register/index';

const RegisterPage: React.FC = () => {
    return (
        <DefaultLayout>
            <HelmetInstance title="Đăng ký" />
            <PageHeader title="Đăng Ký" />
            <Register />
        </DefaultLayout>
    );
};

export default RegisterPage;
