import React from 'react';
import HelmetInstance from '../../utils/HelmetInstance';
import DefaultLayout from '../layouts/DefaultLayout';
import Employee from '../components/Employee/index';

const EmployeePage: React.FC = () => {
    return (
        <DefaultLayout>
            <HelmetInstance title="Nhân viên" />
            <Employee />
        </DefaultLayout>
    );
};

export default EmployeePage;
