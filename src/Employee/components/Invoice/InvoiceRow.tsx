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
    userRole: string;
    onAction: () => void;
    onCancel: () => void;
}

const InvoiceRow: React.FC<InvoiceRowProps> = ({ invoice, index, userRole, onAction, onCancel }) => {
    const isActionDisabled =
        invoice.status === InvoiceStatus.Delivered ||
        invoice.status === InvoiceStatus.Received ||
        invoice.status === InvoiceStatus.Cancelled;

    const isCancelDisabled =
        invoice.status === InvoiceStatus.Shipped ||
        invoice.status === InvoiceStatus.Delivered ||
        invoice.status === InvoiceStatus.Received ||
        invoice.status === InvoiceStatus.Cancelled;

    const isShipperAction = userRole !== 'Shipper' && invoice.status === 3;

    return (
        <tr>
            <td>{index + 1}</td>
            <td className="cursor-pointer underline-on-hover" onClick={onAction}>
                {invoice.id}
            </td>
            <td>{invoice.customerName}</td>
            <td>{invoice.createDate}</td>
            <td>{invoice.totalPayment.toLocaleString() + ' ₫'}</td>
            <td className="text-center">
                <span className={`badge ${getStatusBadgeClass(invoice.status)}`}>{getStatusText(invoice.status)}</span>
            </td>
            <td>
                <div className="d-flex justify-content-between">
                    {/* <button className="btn btn-gray btn-sm mr-2" onClick={onDetail}>
                        <i className="fas fa-info-circle"></i> Chi tiết
                    </button> */}
                    <button
                        className={`btn btn-sm ${getActionBtnClassName(invoice.status)} mr-2`}
                        onClick={onAction}
                        disabled={isActionDisabled || isShipperAction}
                    >
                        <i className={`${getActionBtnIcon(invoice.status)}`}></i> {getActionButtonText(invoice.status)}
                    </button>
                    <button className="btn btn-danger btn-sm" onClick={onCancel} disabled={isCancelDisabled}>
                        <i className="fas fa-trash-alt"></i> Huỷ
                    </button>
                </div>
            </td>
        </tr>
    );
};

export default InvoiceRow;
