import React from 'react';
import {
    InvoiceStatus,
    getStatusText,
    getActionButtonText,
    getActionBtnClassName,
    getActionBtnIcon,
    getStatusBadgeClass,
} from '../../../utils/getStatusInvoice';

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
    const isActionDisabled = invoice.status === InvoiceStatus.Received || invoice.status === InvoiceStatus.Cancelled;

    const isCancelDisabled =
        invoice.status === InvoiceStatus.Shipped ||
        invoice.status === InvoiceStatus.Received ||
        invoice.status === InvoiceStatus.Cancelled;

    return (
        <tr>
            <td>{index + 1}</td>
            <td>{invoice.customerName}</td>
            <td>{invoice.createDate}</td>
            <td>{invoice.total.toLocaleString() + ' ₫'}</td>
            <td className="text-center">
                <span className={`badge ${getStatusBadgeClass(invoice.status)}`}>{getStatusText(invoice.status)}</span>
            </td>
            <td>
                <div className="d-flex justify-content-between">
                    <button className="btn btn-gray btn-sm mr-2" onClick={onDetail}>
                        <i className="fas fa-info-circle"></i> Chi tiết
                    </button>
                    <button
                        className={`btn btn-sm ${getActionBtnClassName(invoice.status)} mr-2`}
                        onClick={onAction}
                        disabled={isActionDisabled}
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
