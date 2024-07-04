import React, { useEffect, useState } from 'react';
import AxiosInstance from '../../../services/AxiosInstance';
import Swal from 'sweetalert2';

const Home: React.FC = () => {
    const [report, setReport] = useState({
        totalRevenue: 0,
        totalSoldProducts: 0,
        totalCustomers: 0,
        totalEmployees: 0,
        topSellingProducts: [],
    });

    const fetchReport = async () => {
        try {
            const response = await AxiosInstance.get('/Report');

            if (response.status === 200) {
                setReport({
                    totalRevenue: response.data.totalRevenue,
                    totalSoldProducts: response.data.totalSoldProducts,
                    totalCustomers: response.data.totalCustomers,
                    totalEmployees: response.data.totalEmployees,
                    topSellingProducts: response.data.topSellingProducts,
                });
            }
        } catch (error) {
            console.error('Lỗi khi tải dữ liệu: ', error);

            Swal.fire({
                title: 'Lỗi khi tải dữ liệu!',
                icon: 'error',
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
            });
        }
    };

    useEffect(() => {
        fetchReport();
    }, []);

    return (
        <>
            <div className="mt-3">
                <div className="row">
                    <div className="col-lg-3 col-6">
                        <div className="small-box bg-info">
                            <div className="inner">
                                <h3>{report.totalSoldProducts}</h3>

                                <p>Sản phẩm đã bán</p>
                            </div>
                            <div className="icon">
                                <i className="ion ion-bag"></i>
                            </div>
                            <a href="#" className="small-box-footer">
                                Xem thêm <i className="fas fa-arrow-circle-right"></i>
                            </a>
                        </div>
                    </div>
                    <div className="col-lg-3 col-6">
                        <div className="small-box bg-success">
                            <div className="inner">
                                <h3>{report.totalRevenue.toLocaleString() + ' ₫'}</h3>

                                <p>Tổng doanh thu</p>
                            </div>
                            <div className="icon">
                                <i className="ion ion-stats-bars"></i>
                            </div>
                            <a href="#" className="small-box-footer">
                                Xem thêm <i className="fas fa-arrow-circle-right"></i>
                            </a>
                        </div>
                    </div>
                    <div className="col-lg-3 col-6">
                        <div className="small-box bg-warning">
                            <div className="inner">
                                <h3>{report.totalCustomers}</h3>

                                <p>Tổng khách hàng</p>
                            </div>
                            <div className="icon">
                                <i className="ion ion-person-add"></i>
                            </div>
                            <a href="#" className="small-box-footer">
                                Xem thêm <i className="fas fa-arrow-circle-right"></i>
                            </a>
                        </div>
                    </div>
                    <div className="col-lg-3 col-6">
                        <div className="small-box bg-danger">
                            <div className="inner">
                                <h3>{report.totalEmployees}</h3>

                                <p>Tổng nhân viên</p>
                            </div>
                            <div className="icon">
                                <i className="ion ion-pie-graph"></i>
                            </div>
                            <a href="#" className="small-box-footer">
                                Xem thêm <i className="fas fa-arrow-circle-right"></i>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Home;
