import React from 'react';
import { Helmet } from 'react-helmet';

const HelmetInstance: React.FC<{ title: string }> = ({ title }) => {
    return (
        <Helmet>
            <title>{title}</title>
        </Helmet>
    );
};

export default HelmetInstance;
