import React from 'react';
import HelmetInstance from '../../utils/HelmetInstance';
import DefaultLayout from '../layouts/DefaultLayout';
import PageHeader from '../components/PageHeader/index';
import NotFound from './../components/NotFound/index';

const NotFoundPage: React.FC = () => {
    return (
        <DefaultLayout>
            <HelmetInstance title="404" />
            <PageHeader title="404" />
            <NotFound />
        </DefaultLayout>
    );
};

export default NotFoundPage;
