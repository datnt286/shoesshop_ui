import React from 'react';
import { InvoiceStatus, getStatusText } from '../../../utils/getStatusText';

interface Invoice {
    id: number;
    userId: string;
    customerName: string;
    createDate: string;
    total: number;
    shippingFee: number;
    totalPayment: number;
    note: string;
    status: number;
}

interface InvoiceRowProps {
    invoice: Invoice;
    index: number;
    onAction: () => void;
    onCancel: () => void;
    onDetail: () => void;
}

const InvoiceRow: React.FC<InvoiceRowProps> = ({ invoice, index, onAction, onCancel, onDetail }) => {
    const isCancelDisabled =
        invoice.status === InvoiceStatus.Shipped ||
        invoice.status === InvoiceStatus.Received ||
        invoice.status === InvoiceStatus.Cancelled;

    const getActionButtonText = (status: InvoiceStatus): string => {
        switch (status) {
            case InvoiceStatus.Placed:
                return 'Duyệt đơn';
            case InvoiceStatus.Approved:
                return 'Vận chuyển';
            case InvoiceStatus.Shipped:
                return 'Đang vận chuyển';
            case InvoiceStatus.Received:
                return 'Đã nhận';
            case InvoiceStatus.Cancelled:
                return 'Đã huỷ';
            default:
                return 'Không rõ';
        }
    };

    const getActionBtnClassName = (status: InvoiceStatus): string => {
        switch (status) {
            case InvoiceStatus.Placed:
                return 'btn-blue';
            case InvoiceStatus.Approved:
                return 'btn-secondary';
            case InvoiceStatus.Shipped:
                return 'btn-info';
            case InvoiceStatus.Received:
                return 'btn-success';
            case InvoiceStatus.Cancelled:
                return 'btn-gray';
            default:
                return 'btn-gray';
        }
    };

    const getActionBtnIcon = (status: InvoiceStatus): string => {
        switch (status) {
            case InvoiceStatus.Placed:
                return 'fas fa-edit';
            case InvoiceStatus.Approved:
                return 'fas fa-truck-moving';
            case InvoiceStatus.Shipped:
                return 'fas fa-shipping-fast';
            case InvoiceStatus.Received:
                return 'fas fa-check-circle';
            case InvoiceStatus.Cancelled:
                return 'fas fa-times';
            default:
                return 'fas fa-question';
        }
    };

    const getStatusBadgeClass = (status: InvoiceStatus): string => {
        switch (status) {
            case InvoiceStatus.Placed:
                return 'badge-primary';
            case InvoiceStatus.Approved:
                return 'badge-danger';
            case InvoiceStatus.Shipped:
                return 'badge-info';
            case InvoiceStatus.Received:
                return 'badge-success';
            case InvoiceStatus.Cancelled:
                return 'badge-secondary';
            default:
                return 'badge-secondary';
        }
    };

    return (
        <tr>
            <td>{index + 1}</td>
            <td>{invoice.customerName}</td>
            <td>{invoice.createDate}</td>
            <td>{invoice.total.toLocaleString() + ' ₫'}</td>
            <td>{invoice.shippingFee.toLocaleString() + ' ₫'}</td>
            <td>{invoice.totalPayment.toLocaleString() + ' ₫'}</td>
            <td>
                <span className={`badge ${getStatusBadgeClass(invoice.status)}`}>{getStatusText(invoice.status)}</span>
            </td>
            <td>
                <div className="project-actions text-right">
                    <button className="btn btn-gray btn-sm mr-2" onClick={onDetail}>
                        <i className="fas fa-info-circle"></i> Chi tiết
                    </button>
                    <button
                        className={`btn btn-sm ${getActionBtnClassName(invoice.status)} mr-2`}
                        onClick={onAction}
                        disabled={isCancelDisabled}
                    >
                        <i className={`${getActionBtnIcon(invoice.status)}`}></i> {getActionButtonText(invoice.status)}
                    </button>
                    <button className="btn btn-danger btn-sm" onClick={onCancel} disabled={isCancelDisabled}>
                        <i className="fas fa-times"></i> Huỷ đơn
                    </button>
                </div>
            </td>
        </tr>
    );
};

export default InvoiceRow;
