import React from 'react';
import HelmetInstance from '../../utils/HelmetInstance';
import DefaultLayout from '../layouts/DefaultLayout';
import PageHeader from '../components/PageHeader/index';
import ChangePassword from '../components/ChangePassword';

const ChangePasswordPage: React.FC = () => {
    return (
        <DefaultLayout>
            <HelmetInstance title="Đổi mật khẩu" />
            <PageHeader title="Đổi Mật Khẩu" />
            <ChangePassword />
        </DefaultLayout>
    );
};

export default ChangePasswordPage;
