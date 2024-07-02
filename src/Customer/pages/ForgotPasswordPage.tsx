import React from 'react';
import HelmetInstance from '../../utils/HelmetInstance';
import DefaultLayout from '../layouts/DefaultLayout';
import PageHeader from '../components/PageHeader/index';
import ForgotPassword from '../components/ForgotPassword/index';

const ForgotPasswordPage: React.FC = () => {
    return (
        <DefaultLayout>
            <HelmetInstance title="Quên mật khẩu" />
            <PageHeader title="Quên Mật Khẩu" />
            <ForgotPassword />
        </DefaultLayout>
    );
};

export default ForgotPasswordPage;
