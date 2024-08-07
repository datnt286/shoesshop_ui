import React, { useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { jwtDecode } from 'jwt-decode';
import Swal from 'sweetalert2';
import AxiosInstance from '../../../services/AxiosInstance';
import Pagination from '../Pagination/index';
import InvoiceRow from './InvoiceRow';
import InvoiceDetailRow from './InvoiceDetailRow';
import ExportExcelButton from './../ExportExcelButton/index';
import { getStatusText, getActionButtonText, getActionBtnIcon } from '../../../utils/getStatusInvoice';

interface User {
    role?: string;
}

interface Invoice {
    id: number;
    userId: string;
    customerName: string;
    phoneNumber: string;
    address: string;
    createDate: string;
    paymentMethod: string;
    total: number;
    shippingFee: number;
    totalPayment: number;
    note: string;
    status: number;
    invoiceDetails: InvoiceDetail[];
}

interface InvoiceDetail {
    id: number;
    modelId: number;
    productName: string;
    productImage: string;
    price: number;
    quantity: number;
    amount: number;
}

const Invoice: React.FC = () => {
    const [token, setToken] = useState<string | null>(null);
    const [userRole, setUserRole] = useState<string | null>(null);
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [statusFilter, setStatusFilter] = useState<number | undefined>(undefined);

    const fetchInvoices = async (currentPage = 1, pageSize = 10, status?: number) => {
        try {
            const response = await AxiosInstance.get('/Invoices/paged', {
                params: {
                    currentPage,
                    pageSize,
                    status,
                },
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.status === 200) {
                setInvoices(response.data.items);
                setTotalPages(response.data.totalPages);
            }
        } catch (error) {
            console.error('Lỗi khi tải dữ liệu: ', error);

            Swal.fire({
                title: 'Lỗi khi tải dữ liệu!',
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
        if (token) {
            fetchInvoices();
        }
    }, [token]);

    useEffect(() => {
        const token = localStorage.getItem('employeeToken');

        if (token) {
            try {
                const decodedToken: User = jwtDecode<User>(token);

                setToken(token);
                setUserRole(decodedToken.role || '');
            } catch (error) {
                console.error('Token không hợp lệ: ', token);
            }
        }
    }, []);

    const handlePageChange = ({ selected }: { selected: number }) => {
        const currentPage = selected + 1;
        fetchInvoices(currentPage, 10, statusFilter);
    };

    const handleStatusSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedStatus = parseInt(event.target.value);
        setStatusFilter(selectedStatus);
        fetchInvoices(1, 10, selectedStatus);
    };

    const handleActionClick = (invoice: Invoice) => {
        setSelectedInvoice(invoice);
        setShowModal(true);
    };

    const handleCloseModal = () => setShowModal(false);

    const handleStatusChange = async () => {
        if (selectedInvoice) {
            const newStatus = (selectedInvoice.status += 1);

            try {
                const response = await AxiosInstance.put(
                    `/Invoices/${selectedInvoice.id}/status`,
                    {
                        status: newStatus,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    },
                );

                if (response.status === 200) {
                    Swal.fire({
                        title: 'Cập nhật trạng thái thành công!',
                        icon: 'success',
                        toast: true,
                        position: 'top-end',
                        timerProgressBar: true,
                        showConfirmButton: false,
                        timer: 1000,
                    });

                    fetchInvoices();
                    setShowModal(false);
                }
            } catch (error) {
                console.error('Lỗi khi cập nhật trạng thái: ', error);

                Swal.fire({
                    title: 'Lỗi khi cập nhật trạng thái!',
                    icon: 'error',
                    toast: true,
                    position: 'top-end',
                    timerProgressBar: true,
                    showConfirmButton: false,
                    timer: 3000,
                });
            }
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
                const response = await AxiosInstance.put(
                    `/Invoices/${invoiceId}/status`,
                    {
                        status: 6,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    },
                );

                if (response.status === 200) {
                    Swal.fire({
                        title: 'Huỷ đơn thành công!',
                        icon: 'success',
                        toast: true,
                        position: 'top-end',
                        timerProgressBar: true,
                        showConfirmButton: false,
                        timer: 1000,
                    });

                    fetchInvoices();
                }
            } catch (error) {
                console.error('Lỗi khi huỷ đơn: ', error);

                Swal.fire({
                    title: 'Lỗi khi huỷ đơn!',
                    icon: 'error',
                    toast: true,
                    position: 'top-end',
                    timerProgressBar: true,
                    showConfirmButton: false,
                    timer: 3000,
                });
            }
        }
    };

    return (
        <>
            <div className="row my-4">
                <div className="col-9">
                    <h1 className="m-0">{userRole !== 'Shipper' ? 'Quản lý hoá đơn' : 'Danh sách hoá đơn'}</h1>
                </div>
            </div>

            <div className="card">
                <div className="card-header">
                    {userRole !== 'Shipper' && <ExportExcelButton endpoint="/Invoices" filename="hoa-don" />}
                    <div className="float-right">
                        <select className="form-select" value={statusFilter} onChange={handleStatusSelectChange}>
                            <option value={0}>Tất cả</option>
                            {userRole !== 'Shipper' && (
                                <>
                                    <option value={1}>Đã đặt</option>
                                    <option value={2}>Đã duyệt</option>
                                </>
                            )}
                            <option value={3}>Đang vận chuyển</option>
                            <option value={4}>Đã giao</option>
                            <option value={5}>Đã nhận</option>
                            <option value={6}>Đã huỷ</option>
                        </select>
                    </div>
                </div>
                <div className="card-body">
                    <table className="table table-bordered table-striped">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Mã hoá đơn</th>
                                <th>Tên khách hàng</th>
                                <th>Ngày đặt</th>
                                <th>Thành tiền</th>
                                <th>Trạng thái</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {invoices.length > 0 ? (
                                invoices.map((invoice, index) => {
                                    return (
                                        <InvoiceRow
                                            key={invoice.id}
                                            index={index}
                                            invoice={invoice}
                                            userRole={userRole || ''}
                                            onAction={() => handleActionClick(invoice)}
                                            onCancel={() => handleCancelInvoice(invoice.id)}
                                        />
                                    );
                                })
                            ) : (
                                <h3 className="m-2">Danh sách hoá đơn trống.</h3>
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="card-footer clearfix">
                    <Pagination totalPages={totalPages} onPageChange={handlePageChange} />
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
                            <div className="col-xl-6">
                                <div className="form-group">
                                    <span className="text-lg font-weight-bold">Họ tên: </span>
                                    <span className="text-lg">{selectedInvoice.customerName}</span>
                                </div>
                                <div className="form-group">
                                    <span className="text-lg font-weight-bold">Điện thoại: </span>
                                    <span className="text-lg">{selectedInvoice.phoneNumber}</span>
                                </div>
                                <div className="form-group">
                                    <span className="text-lg font-weight-bold">Địa chỉ: </span>
                                    <span className="text-lg">{selectedInvoice.address}</span>
                                </div>
                                <div className="form-group">
                                    <span className="text-lg font-weight-bold">Ghi chú: </span>
                                    <span className="text-lg">{selectedInvoice.note}</span>
                                </div>
                            </div>
                            <div className="col-xl-6">
                                <div className="form-group">
                                    <span className="text-lg font-weight-bold">Phương thức thanh toán: </span>
                                    <span className="text-lg">{selectedInvoice.paymentMethod}</span>
                                </div>
                                <div className="form-group">
                                    <span className="text-lg font-weight-bold">Tổng tiền: </span>
                                    <span className="text-lg">{selectedInvoice.total.toLocaleString() + ' ₫'}</span>
                                </div>
                                <div className="form-group">
                                    <span className="text-lg font-weight-bold">Phí vận chuyển: </span>
                                    <span className="text-lg">
                                        {selectedInvoice.shippingFee.toLocaleString() + ' ₫'}
                                    </span>
                                </div>
                                <div className="form-group">
                                    <span className="text-lg font-weight-bold">Tổng thanh toán: </span>
                                    <span className="text-lg">
                                        {selectedInvoice.totalPayment.toLocaleString() + ' ₫'}
                                    </span>
                                </div>
                                <div className="form-group">
                                    <span className="text-lg font-weight-bold">Trạng thái: </span>
                                    <span className="text-lg">{getStatusText(selectedInvoice.status)}</span>
                                </div>
                            </div>
                            <table className="table table-bordered table-striped">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Hình ảnh</th>
                                        <th>Tên</th>
                                        <th>Giá bán</th>
                                        <th>Số lượng</th>
                                        <th>Thành tiền</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedInvoice.invoiceDetails.map((invoiceDetail, index) => {
                                        return (
                                            <InvoiceDetailRow
                                                key={invoiceDetail.id}
                                                index={index}
                                                invoiceDetail={invoiceDetail}
                                            />
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="gray" onClick={handleCloseModal}>
                        <i className="fas fa-times-circle"></i> Đóng
                    </Button>
                    {selectedInvoice &&
                        (selectedInvoice.status === 1 ||
                            selectedInvoice.status === 2 ||
                            selectedInvoice.status === 3) && (
                            <Button
                                variant={
                                    selectedInvoice.status === 1
                                        ? 'blue'
                                        : selectedInvoice.status === 2
                                        ? 'info'
                                        : 'warning'
                                }
                                onClick={handleStatusChange}
                            >
                                <i className={`${getActionBtnIcon(selectedInvoice.status)}`}></i>{' '}
                                {getActionButtonText(selectedInvoice.status)}
                            </Button>
                        )}
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default Invoice;
