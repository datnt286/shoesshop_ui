import React from 'react';
import HelmetInstance from '../../utils/HelmetInstance';
import DefaultLayout from '../layouts/DefaultLayout';
import PageHeader from '../components/PageHeader/index';
import ResetPassword from '../components/ResetPassword';

const ResetPasswordPage: React.FC = () => {
    return (
        <DefaultLayout>
            <HelmetInstance title="Đặt lại mật khẩu" />
            <PageHeader title="Đặt lại mật khẩu" />
            <ResetPassword />
        </DefaultLayout>
    );
};

export default ResetPasswordPage;
