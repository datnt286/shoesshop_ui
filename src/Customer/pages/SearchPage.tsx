import React from 'react';
import { useParams } from 'react-router-dom';
import HelmetInstance from '../../utils/HelmetInstance';
import DefaultLayout from '../layouts/DefaultLayout';
import PageHeader from '../components/PageHeader/index';
import Shop from '../components/Shop/index';

const SearchPage: React.FC = () => {
    const { keyword } = useParams<{ keyword: string }>();

    return (
        <DefaultLayout>
            <HelmetInstance title="Kết quả tìm kiếm" />
            <PageHeader title="Cửa Hàng" />
            <Shop keyword={keyword} heading={`Kết quả tìm kiếm: ${keyword}`} />
        </DefaultLayout>
    );
};

export default SearchPage;
