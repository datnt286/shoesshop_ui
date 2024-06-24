import React, { ReactNode, useEffect, useState } from 'react';

import '../resources/plugins/ionicons-2.0.1/css/ionicons.min.css';
import '../resources/plugins/fontawesome-free/css/all.min.css';
import '../resources/dist/css/adminlte.min.css';
import '../resources/css/style.css';

import '../resources/plugins/jquery-ui/jquery-ui.min.js';
import '../resources/plugins/bootstrap/js/bootstrap.bundle.min.js';
import '../resources/dist/js/adminlte.js';

import Navbar from './../components/Navbar/index';
import Sidebar from './../components/Sidebar/index';
import Footer from './../components/Footer/index';

interface DefaultLayoutProps {
    children: ReactNode;
}

const DefaultLayout: React.FC<DefaultLayoutProps> = ({ children }) => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 1000);
    }, []);

    return (
        <>
            <div className="sidebar-mini layout-fixed">
                <div className="wrapper">
                    <Navbar />
                    <Sidebar />
                    <div className="content-wrapper">
                        <section className="content">
                            <div className="container-fluid">
                                <div className="row">
                                    <div className="col-12">
                                        <main>{children}</main>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                    <Footer />
                </div>
            </div>
        </>
    );
};

export default DefaultLayout;
