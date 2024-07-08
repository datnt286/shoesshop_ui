import React, { useEffect, useRef, useState } from 'react';
import Chart, { ChartOptions, ChartData } from 'chart.js/auto'; // Import Chart.js 3
import Swal from 'sweetalert2';
import AxiosInstance from '../../../services/AxiosInstance';
import config from '../../../services/config';
import DefaultImage from '../../resources/img/default-image.jpg';

interface Product {
    id: number;
    name: string;
    price: number;
    image: string;
    quantitySold: number;
}

const Home: React.FC = () => {
    const [report, setReport] = useState({
        totalRevenue: 0,
        totalSoldProducts: 0,
        totalCustomers: 0,
        totalEmployees: 0,
        topSellingProducts: [] as Product[],
        monthlyRevenue: [] as number[],
    });
    const [topSellingProducts, setTopSellingProducts] = useState<Product[]>([]);
    const [topSellingProductsFilter, setTopSellingProductsFilter] = useState(0);

    const chartRef = useRef<Chart | null>(null);

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
                    monthlyRevenue: response.data.monthlyRevenue,
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

    const fetchTopSellingProducts = async () => {
        try {
            const response = await AxiosInstance.get('/Report/TopSellingProducts', {
                params: { topSellingProductsFilter },
            });

            if (response.status === 200) {
                setTopSellingProducts(response.data);
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

    useEffect(() => {
        fetchTopSellingProducts();
    }, [topSellingProductsFilter]);

    useEffect(() => {
        if (chartRef.current) {
            chartRef.current.destroy();
        }

        const ctx = document.getElementById('bar-chart') as HTMLCanvasElement;
        if (ctx) {
            const chartData: ChartData<'bar', number[], string> = {
                labels: [
                    'Tháng 1',
                    'Tháng 2',
                    'Tháng 3',
                    'Tháng 4',
                    'Tháng 5',
                    'Tháng 6',
                    'Tháng 7',
                    'Tháng 8',
                    'Tháng 9',
                    'Tháng 10',
                    'Tháng 11',
                    'Tháng 12',
                ],
                datasets: [
                    {
                        label: 'Doanh thu theo tháng',
                        data: report.monthlyRevenue,
                        backgroundColor: 'rgba(54, 162, 235, 0.2)',
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 1,
                    },
                ],
            };

            const chartOptions: ChartOptions<'bar'> = {
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function (value: string | number) {
                                return value.toLocaleString() + ' ₫';
                            },
                            stepSize: 5000000,
                        },
                    },
                },
            };

            chartRef.current = new Chart(ctx, {
                type: 'bar',
                data: chartData,
                options: chartOptions,
            });
        }
    }, [report.monthlyRevenue]);

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
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-12 col-12">
                        <div className="card">
                            <div className="card-header">
                                <span className="h4">Doanh thu theo tháng</span>
                            </div>
                            <div className="card-body">
                                <canvas id="bar-chart"></canvas>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-12 col-12">
                        <div className="card">
                            <div className="card-header">
                                <span className="h4">Top 5 sản phẩm bán chạy</span>
                                <div className="float-right">
                                    <select
                                        className="form-select"
                                        value={topSellingProductsFilter}
                                        onChange={(e) => setTopSellingProductsFilter(parseInt(e.target.value))}
                                    >
                                        <option value={1}>Hôm nay</option>
                                        <option value={2}>Theo tuần</option>
                                        <option value={3}>Theo tháng</option>
                                        <option value={4}>Theo năm</option>
                                    </select>
                                </div>
                            </div>
                            <div className="card-body">
                                <table className="table table-bordered table-striped">
                                    <thead>
                                        <tr>
                                            <th scope="col">#</th>
                                            <th scope="col">Hình ảnh</th>
                                            <th scope="col">Tên</th>
                                            <th scope="col">Giá bán</th>
                                            <th scope="col">Số lượng đã bán</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {topSellingProducts.length > 0 ? (
                                            topSellingProducts.map((product, index) => {
                                                const imageSrc = product.image
                                                    ? `${config.baseURL}/images/product/${product.image}`
                                                    : DefaultImage;

                                                return (
                                                    <tr key={index}>
                                                        <th scope="row">{index + 1}</th>
                                                        <td>
                                                            <img
                                                                src={imageSrc}
                                                                className="img img-thumbnail"
                                                                style={{ maxWidth: '100px', maxHeight: '100px' }}
                                                                alt="Ảnh sản phẩm"
                                                            />
                                                        </td>
                                                        <td>{product.name}</td>
                                                        <td>{product.price.toLocaleString() + ' ₫'}</td>
                                                        <td>{product.quantitySold}</td>
                                                    </tr>
                                                );
                                            })
                                        ) : (
                                            <h3 className="m-2">Danh sách sản phẩm trống.</h3>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Home;
