import React from 'react';
import EmployeeRoutes from './Employee/routes/AppRoutes';
import CustomerRoutes from './Customer/routes/AppRoutes';

const App: React.FC = () => {
    return (
        <>
            {/* <EmployeeRoutes /> */}
            <CustomerRoutes />
        </>
    );
};

export default App;
