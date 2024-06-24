import React from 'react';
import { Route, Routes } from 'react-router-dom';
import EmployeeRoutes from './Employee/routes/AppRoutes';
import CustomerRoutes from './Customer/routes/AppRoutes';

const App: React.FC = () => {
    return (
        <Routes>
            <Route path="/admin/*" element={<EmployeeRoutes />} />
            <Route path="/*" element={<CustomerRoutes />} />
        </Routes>
    );
};

export default App;
