import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import config from '../../../services/config';
import DefaultImage from '../../resources/img/default-image.jpg';

interface CartDetail {
    id: number;
    modelId: number;
    productId: number;
    productName: string;
    productImage: string;
    price: number;
    quantity: number;
    quantityAvailable: number;
    amount: number;
}

interface TableRowProps {
    cartDetail: CartDetail;
}

const TableRow: React.FC<TableRowProps> = ({ cartDetail }) => {
    const [quantityAvailableError, setQuantityAvailableError] = useState(
        cartDetail.quantity > cartDetail.quantityAvailable,
    );

    const imageSrc = cartDetail.productImage
        ? `${config.baseURL}/images/product/${cartDetail.productImage}`
        : DefaultImage;

    useEffect(() => {
        setQuantityAvailableError(cartDetail.quantity > cartDetail.quantityAvailable);
    }, [cartDetail]);

    return (
        <tr>
            <th scope="row">
                <Link to={`/san-pham/${cartDetail.modelId}`}>
                    <div className="d-flex align-items-center">
                        <img
                            src={imageSrc}
                            className="img-fluid rounded-circle"
                            style={{ width: '90px', height: '90px' }}
                            alt="Ảnh sản phẩm"
                        />
                    </div>
                </Link>
            </th>
            <td className="py-5">
                <Link to={`/san-pham/${cartDetail.modelId}`}>{cartDetail.productName}</Link>
            </td>
            <td className="py-5">{cartDetail.price.toLocaleString() + ' ₫'}</td>
            <td className="py-5 text-center">
                {cartDetail.quantity}
                {quantityAvailableError && (
                    <div className="text-danger">Số lượng sản phẩm không đủ: {cartDetail.quantityAvailable}</div>
                )}
            </td>
            <td className="py-5">{cartDetail.amount.toLocaleString() + ' ₫'}</td>
        </tr>
    );
};

export default TableRow;
