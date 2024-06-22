import React from 'react';
import DefaultLayout from './../layouts/DefaultLayout';
import PageHeader from './../components/PageHeader/index';
import Detail from '../components/Detail';

const DetailPage: React.FC = () => {
    return (
        <DefaultLayout>
            <PageHeader title="Sản Phẩm" />
            <Detail />
        </DefaultLayout>
    );
};

export default DetailPage;
