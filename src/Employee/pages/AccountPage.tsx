import React from 'react';
import HelmetInstance from '../../utils/HelmetInstance';
import DefaultLayout from '../layouts/DefaultLayout';
import Account from '../components/Account/index';

const AccountPage: React.FC = () => {
    return (
        <DefaultLayout>
            <HelmetInstance title="Tài khoản" />
            <Account />
        </DefaultLayout>
    );
};

export default AccountPage;
