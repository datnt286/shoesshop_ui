import React from 'react';
import config from '../../../services/config';
import DefaultImage from '../../resources/img/default-image.jpg';

interface InvoiceDetail {
    id: number;
    modelId: number;
    productName: string;
    productImage: string;
    price: number;
    quantity: number;
    amount: number;
}

interface InvoiceDetailRowProps {
    invoiceDetail: InvoiceDetail;
    index: number;
}

const InvoiceDetailRow: React.FC<InvoiceDetailRowProps> = ({ invoiceDetail, index }) => {
    const imageSrc = invoiceDetail.productImage
        ? `${config.baseURL}/images/product/${invoiceDetail.productImage}`
        : DefaultImage;

    return (
        <tr>
            <td>{index + 1}</td>
            <img
                src={imageSrc}
                className="img img-thumbnail"
                style={{ maxWidth: '100px', maxHeight: '100px' }}
                alt="Ảnh sản phẩm"
            />
            <td>{invoiceDetail.productName}</td>
            <td>{invoiceDetail.price.toLocaleString() + ' ₫'}</td>
            <td>{invoiceDetail.quantity}</td>
            <td>{invoiceDetail.amount.toLocaleString() + ' ₫'}</td>
            <td></td>
        </tr>
    );
};

export default InvoiceDetailRow;
