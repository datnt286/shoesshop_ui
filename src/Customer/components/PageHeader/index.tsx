import React from 'react';
import { Link } from 'react-router-dom';

interface PageHeaderProps {
    title: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title }) => {
    return (
        <div className="container-fluid page-header py-5">
            <h1 className="text-center text-white display-6">{title}</h1>
            <ol className="breadcrumb justify-content-center mb-0">
                <li className="breadcrumb-item">
                    <Link to="/">Trang Chủ</Link>
                </li>
                <li className="breadcrumb-item active text-white">{title}</li>
            </ol>
        </div>
    );
};

export default PageHeader;
