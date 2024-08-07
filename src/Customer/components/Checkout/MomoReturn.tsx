import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import AxiosInstance from '../../../services/AxiosInstance';

const MomoReturn: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const handleMomoReturn = async () => {
        const searchParams = new URLSearchParams(location.search);
        const resultCode = searchParams.get('resultCode');

        if (resultCode === '9000') {
            try {
                const token = localStorage.getItem('customerToken');
                const InvoiceDataString = localStorage.getItem('InvoiceData');

                if (!InvoiceDataString) {
                    throw new Error('No InvoiceData found in localStorage');
                }

                const InvoiceData = JSON.parse(InvoiceDataString);

                const response = await AxiosInstance.post('/Invoices', InvoiceData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.status === 200) {
                    localStorage.removeItem('InvoiceData');
                    navigate('/hoa-don');

                    Swal.fire({
                        title: 'Đặt hàng thành công!',
                        icon: 'success',
                        toast: true,
                        position: 'top-end',
                        timerProgressBar: true,
                        showConfirmButton: false,
                        timer: 3000,
                    });
                }
            } catch (error) {
                console.error('Lỗi khi đặt hàng: ', error);

                if (axios.isAxiosError(error)) {
                    if (error.response && error.response.status === 400) {
                        const apiError = error.response.data;
                        if (apiError === 'Product not available or insufficient quantity.') {
                            Swal.fire({
                                title: 'Số lượng sản phẩm không đủ! Vui lòng thử lại.',
                                icon: 'error',
                                toast: true,
                                position: 'top-end',
                                timerProgressBar: true,
                                showConfirmButton: false,
                                timer: 3000,
                            });
                        }
                    }
                } else {
                    Swal.fire({
                        title: 'Đặt hàng thất bại! Vui lòng thử lại.',
                        icon: 'error',
                        toast: true,
                        position: 'top-end',
                        timerProgressBar: true,
                        showConfirmButton: false,
                        timer: 3000,
                    });
                }
            }
        } else {
            navigate('/thanh-toan');

            Swal.fire({
                title: 'Đặt hàng thất bại! Vui lòng thử lại.',
                icon: 'error',
                toast: true,
                position: 'top-end',
                timerProgressBar: true,
                showConfirmButton: false,
                timer: 3000,
            });
        }
    };

    useEffect(() => {
        handleMomoReturn();
    }, []);

    return <></>;
};

export default MomoReturn;
