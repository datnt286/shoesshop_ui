import React from 'react';
import { getStatusText, InvoiceStatus } from '../../../utils/getStatusInvoice';

interface InvoiceDetail {
    id: number;
    invoiceId: number;
    productId: number;
    productName: string;
    productImage: string;
    modelId: number;
    price: number;
    quantity: number;
    amount: number;
}

interface Invoice {
    id: number;
    userId: string;
    paymentMethod: string;
    createDate: string;
    total: number;
    shippingFee: number;
    totalPayment: number;
    status: number;
    invoiceDetails: InvoiceDetail[];
}

interface InvoiceTableProps {
    tab: string;
    invoices: Invoice[];
    onDetail: (invoice: Invoice) => void;
    onConfirm: (invoiceId: number) => void;
    onCancel: (invoiceId: number) => void;
}

const InvoiceTable: React.FC<InvoiceTableProps> = ({ tab, invoices, onDetail, onConfirm, onCancel }) => {
    const getStatusBadgeClass = (status: InvoiceStatus): string => {
        switch (status) {
            case InvoiceStatus.Placed:
                return 'bg-secondary';
            case InvoiceStatus.Approved:
                return 'bg-info';
            case InvoiceStatus.Shipped:
                return 'bg-primary';
            case InvoiceStatus.Delivered:
                return 'bg-success';
            case InvoiceStatus.Received:
                return 'bg-success';
            case InvoiceStatus.Cancelled:
                return 'bg-gray';
            default:
                return 'bg-gray';
        }
    };

    return (
        <div id={tab} className={`tab-pane ${tab === 'all' ? 'active' : ''}`}>
            {invoices.length > 0 ? (
                <table className="table">
                    <thead>
                        <tr>
                            <th className="text-primary" scope="col">
                                Ngày đặt
                            </th>
                            <th className="text-primary" scope="col">
                                Phương thức thanh toán
                            </th>
                            <th className="text-primary" scope="col">
                                Tổng thanh toán
                            </th>
                            <th className="text-primary" scope="col">
                                Trạng thái
                            </th>
                            <th scope="col"></th>
                            <th scope="col"></th>
                            <th scope="col"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {invoices.map((invoice) => (
                            <tr key={invoice.id}>
                                <td>{invoice.createDate}</td>
                                <td>{invoice.paymentMethod}</td>
                                <td>{invoice.totalPayment.toLocaleString() + ' ₫'}</td>
                                <td>
                                    <span className={`badge ${getStatusBadgeClass(invoice.status)}`}>
                                        {getStatusText(invoice.status)}
                                    </span>
                                </td>
                                <td>
                                    <button
                                        className="btn btn-sm btn-light"
                                        style={{ whiteSpace: 'nowrap' }}
                                        onClick={() => onDetail(invoice)}
                                    >
                                        <i className="fas fa-info-circle"></i> Xem đơn hàng
                                    </button>
                                </td>
                                <td>
                                    {invoice.status === 4 && (
                                        <button
                                            className="btn btn-sm btn-success"
                                            style={{ whiteSpace: 'nowrap' }}
                                            onClick={() => onConfirm(invoice.id)}
                                        >
                                            <i className="fas fa-check"></i> Xác nhận
                                        </button>
                                    )}
                                </td>
                                <td>
                                    {(invoice.status === 1 || invoice.status === 2) && (
                                        <button className="btn btn-sm btn-danger" onClick={() => onCancel(invoice.id)}>
                                            <i className="fas fa-times"></i> Huỷ
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <h3 className="p-2">Danh sách hoá đơn trống.</h3>
            )}
        </div>
    );
};

export default InvoiceTable;
