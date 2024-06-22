import React from 'react';
import HelmetInstance from '../../utils/HelmetInstance';
import DefaultLayout from '../layouts/DefaultLayout';
import PageHeader from '../components/PageHeader/index';
import Contact from '../components/Contact';

const ContactPage: React.FC = () => {
    return (
        <DefaultLayout>
            <HelmetInstance title="Liên hệ" />
            <PageHeader title="Liên Hệ" />
            <Contact />
        </DefaultLayout>
    );
};

export default ContactPage;
