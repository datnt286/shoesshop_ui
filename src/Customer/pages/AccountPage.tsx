import React from 'react';
import HelmetInstance from './../../utils/HelmetInstance';
import DefaultLayout from '../layouts/DefaultLayout';
import PageHeader from '../components/PageHeader/index';
import Account from './../components/Account/index';

const AccountPage: React.FC = () => {
    return (
        <DefaultLayout>
            <HelmetInstance title="Tài khoản" />
            <PageHeader title="Tài Khoản" />
            <Account />
        </DefaultLayout>
    );
};

export default AccountPage;
