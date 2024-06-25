import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Swal from 'sweetalert2';
import AxiosInstance from '../../../services/AxiosInstance';
import config from '../../../services/config';
import InvoiceTable from './InvoiceTable';
import DefaultImage from '../../resources/img/default-image.jpg';

interface User {
    id: string;
}

interface InvoiceDetail {
    id: number;
    invoiceId: number;
    productId: number;
    productName: string;
    productImage: string;
    price: number;
    quantity: number;
    amount: number;
}

interface Invoice {
    id: number;
    userId: string;
    createDate: string;
    total: number;
    shippingFee: number;
    totalPayment: number;
    status: number;
    invoiceDetails: InvoiceDetail[];
}

const Invoice: React.FC = () => {
    const [token, setToken] = useState<string | null>(null);
    const [userId, setUserId] = useState<string | null>(null);
    const [invoices, setInvoices] = useState({
        allInvoices: [],
        placedInvoices: [],
        approvedInvoices: [],
        shippedInvoices: [],
        receivedInvoices: [],
        cancelledInvoices: [],
    });
    const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
    const [showModal, setShowModal] = useState(false);

    const fetchInvoices = async () => {
        try {
            const response = await AxiosInstance.get(`/Invoices/User/${userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.status === 200) {
                setInvoices({
                    allInvoices: response.data.allInvoices,
                    placedInvoices: response.data.shippedInvoices,
                    approvedInvoices: response.data.approvedInvoices,
                    shippedInvoices: response.data.shippedInvoices,
                    receivedInvoices: response.data.receivedInvoices,
                    cancelledInvoices: response.data.cancelledInvoices,
                });
            }
        } catch (error) {
            console.error('Lỗi khi tải dữ liệu: ', error);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('customerToken');

        if (token) {
            try {
                const decodedToken: User = jwtDecode<User>(token);

                setToken(token);
                setUserId(decodedToken.id);
            } catch (error) {
                console.error('Token không hợp lệ: ', token);
            }
        }
    }, []);

    useEffect(() => {
        if (userId) {
            fetchInvoices();
        }
    }, [userId]);

    const handleDetailClick = (invoice: Invoice) => {
        setSelectedInvoice(invoice);
        setShowModal(true);
    };

    const handleCloseModal = () => setShowModal(false);

    const handleConfirmInvoice = async (invoiceId: number) => {
        try {
            const response = await AxiosInstance.put(`/Invoices/${invoiceId}/status`, {
                status: 4,
            });

            if (response.status === 200) {
                Swal.fire({
                    title: 'Xác nhận đơn hàng thành công!',
                    icon: 'success',
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#3085d6',
                });

                fetchInvoices();
            }
        } catch (error) {
            console.error('Lỗi khi xác nhận đơn hàng: ', error);

            Swal.fire({
                title: 'Lỗi khi xác nhận đơn hàng! Vui lòng thử lại.',
                icon: 'error',
                confirmButtonText: 'OK',
                confirmButtonColor: '#3085d6',
            });
        }
    };

    const handleCancelInvoice = async (invoiceId: number) => {
        const result = await Swal.fire({
            title: 'Xác nhận huỷ đơn?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Xác nhận',
            confirmButtonColor: '#d33',
            cancelButtonText: 'Huỷ',
        });

        if (result.isConfirmed) {
            try {
                const response = await AxiosInstance.put(`/Invoices/${invoiceId}/status`, {
                    status: 5,
                });

                if (response.status === 200) {
                    Swal.fire({
                        title: 'Huỷ đơn thành công!',
                        icon: 'success',
                        confirmButtonText: 'OK',
                        confirmButtonColor: '#3085d6',
                    });

                    fetchInvoices();
                }
            } catch (error) {
                console.error('Lỗi khi huỷ đơn: ', error);

                Swal.fire({
                    title: 'Lỗi khi huỷ đơn! Vui lòng thử lại.',
                    icon: 'error',
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#3085d6',
                });
            }
        }
    };

    return (
        <div className="container-fluid py-5">
            <div className="container py-5">
                <div className="row">
                    <div className="col-md-12 col-lg-10 col-xl-10 offset-lg-1 offset-xl-1">
                        <div className="border border-1 rounded p-lg-5">
                            <div className="card">
                                <div className="card-header p-2">
                                    <ul className="nav nav-pills">
                                        <li className="nav-item">
                                            <a href="#all" className="nav-link active" data-bs-toggle="tab">
                                                Tất cả
                                            </a>
                                        </li>
                                        <li className="nav-item">
                                            <a href="#placed" className="nav-link" data-bs-toggle="tab">
                                                Đã đặt
                                            </a>
                                        </li>
                                        <li className="nav-item">
                                            <a href="#approved" className="nav-link" data-bs-toggle="tab">
                                                Đã xác nhận
                                            </a>
                                        </li>
                                        <li className="nav-item">
                                            <a href="#shipped" className="nav-link" data-bs-toggle="tab">
                                                Đang giao
                                            </a>
                                        </li>
                                        <li className="nav-item">
                                            <a href="#received" className="nav-link" data-bs-toggle="tab">
                                                Đã giao
                                            </a>
                                        </li>
                                        <li className="nav-item">
                                            <a href="#cancelled" className="nav-link" data-bs-toggle="tab">
                                                Đã huỷ
                                            </a>
                                        </li>
                                    </ul>
                                </div>

                                <div className="card-body align-middle">
                                    <div className="tab-content">
                                        <InvoiceTable
                                            tab="all"
                                            invoices={invoices.allInvoices}
                                            onDetail={handleDetailClick}
                                            onConfirm={handleConfirmInvoice}
                                            onCancel={handleCancelInvoice}
                                        />
                                        <InvoiceTable
                                            tab="placed"
                                            invoices={invoices.placedInvoices}
                                            onDetail={handleDetailClick}
                                            onConfirm={handleConfirmInvoice}
                                            onCancel={handleCancelInvoice}
                                        />
                                        <InvoiceTable
                                            tab="approved"
                                            invoices={invoices.approvedInvoices}
                                            onDetail={handleDetailClick}
                                            onConfirm={handleConfirmInvoice}
                                            onCancel={handleCancelInvoice}
                                        />
                                        <InvoiceTable
                                            tab="shipped"
                                            invoices={invoices.shippedInvoices}
                                            onDetail={handleDetailClick}
                                            onConfirm={handleConfirmInvoice}
                                            onCancel={handleCancelInvoice}
                                        />
                                        <InvoiceTable
                                            tab="received"
                                            invoices={invoices.receivedInvoices}
                                            onDetail={handleDetailClick}
                                            onConfirm={handleConfirmInvoice}
                                            onCancel={handleCancelInvoice}
                                        />
                                        <InvoiceTable
                                            tab="cancelled"
                                            invoices={invoices.cancelledInvoices}
                                            onDetail={handleDetailClick}
                                            onConfirm={handleConfirmInvoice}
                                            onCancel={handleCancelInvoice}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <Modal size="lg" show={showModal} onHide={handleCloseModal}>
                        <Modal.Header>
                            <Modal.Title>Chi tiết hoá đơn</Modal.Title>
                            <Button variant="light" className="close" aria-label="Close" onClick={handleCloseModal}>
                                <span>&times;</span>
                            </Button>
                        </Modal.Header>
                        <Modal.Body>
                            {selectedInvoice && (
                                <div className="row">
                                    <table className="table table-bordered table-striped">
                                        <thead>
                                            <tr>
                                                <th>#</th>
                                                <th>Hình ảnh</th>
                                                <th>Tên</th>
                                                <th>Giá bán</th>
                                                <th>Số lượng</th>
                                                <th>Thành tiền</th>
                                                <th></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {selectedInvoice.invoiceDetails.map((invoiceDetail, index) => {
                                                const imageSrc = invoiceDetail.productImage
                                                    ? `${config.baseURL}/images/product/${invoiceDetail.productImage}`
                                                    : DefaultImage;

                                                return (
                                                    <tr>
                                                        <td>{index + 1}</td>
                                                        <td>
                                                            <img
                                                                src={imageSrc}
                                                                className="img img-thumbnail"
                                                                style={{ maxWidth: '100px', maxHeight: '100px' }}
                                                                alt="Ảnh sản phẩm"
                                                            />
                                                        </td>
                                                        <td>{invoiceDetail.productName}</td>
                                                        <td>{invoiceDetail.price.toLocaleString() + ' ₫'}</td>
                                                        <td>{invoiceDetail.quantity}</td>
                                                        <td>{invoiceDetail.amount.toLocaleString() + ' ₫'}</td>
                                                        <td>
                                                            <button className="btn border border-secondary rounded-pill px-3 text-primary">
                                                                Hoàn trả
                                                            </button>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                            <tr>
                                                <td colSpan={6} className="text-end">
                                                    Tổng hoá đơn:
                                                </td>
                                                <td>{selectedInvoice.total.toLocaleString() + ' ₫'}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="light" onClick={handleCloseModal}>
                                <i className="fas fa-times-circle"></i> Đóng
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </div>
            </div>
        </div>
    );
};

export default Invoice;
