import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import config from '../../../services/config';
import DefaultImage from '../../resources/img/default-image.jpg';

interface CartDetail {
    id: number;
    modelId: number;
    productName: string;
    productImage: string;
    price: number;
    quantity: number;
    amount: number;
}

interface CartRowProps {
    cartDetail: CartDetail;
    onUpdateQuantity: (id: number, quantity: number, amount: number) => void;
    onDelete: () => void;
}

const CartRow: React.FC<CartRowProps> = ({ cartDetail, onUpdateQuantity, onDelete }) => {
    const [quantity, setQuantity] = useState(cartDetail.quantity);
    const imageSrc = cartDetail.productImage
        ? `${config.baseURL}/images/product/${cartDetail.productImage}`
        : DefaultImage;

    const handleQuantityChange = (newQuantity: number) => {
        if (newQuantity > 0) {
            setQuantity(newQuantity);
            onUpdateQuantity(cartDetail.id, newQuantity, cartDetail.price * newQuantity);
        }
    };

    return (
        <tr>
            <th scope="row">
                <Link to={`/san-pham/${cartDetail.modelId}`}>
                    <div className="d-flex align-items-center">
                        <img
                            src={imageSrc}
                            className="img-fluid me-5 rounded-circle"
                            style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                            alt="Ảnh sản phẩm"
                        />
                    </div>
                </Link>
            </th>
            <td>
                <Link to={`/san-pham/${cartDetail.modelId}`}>
                    <p className="mb-0">{cartDetail.productName}</p>
                </Link>
            </td>
            <td>
                <p className="mb-0">{cartDetail.price.toLocaleString() + ' ₫'}</p>
            </td>
            <td>
                <div className="input-group quantity" style={{ width: '100px' }}>
                    <div className="input-group-btn">
                        <button
                            className="btn btn-sm btn-minus rounded-circle bg-light border"
                            onClick={() => handleQuantityChange(quantity - 1)}
                        >
                            <i className="fa fa-minus"></i>
                        </button>
                    </div>
                    <input
                        type="text"
                        className="form-control form-control-sm text-center border-0"
                        value={quantity}
                        onChange={(e) => handleQuantityChange(Number(e.target.value))}
                        inputMode="numeric"
                        pattern="[0-9]*"
                    />
                    <div className="input-group-btn">
                        <button
                            className="btn btn-sm btn-plus rounded-circle bg-light border"
                            onClick={() => handleQuantityChange(quantity + 1)}
                        >
                            <i className="fa fa-plus"></i>
                        </button>
                    </div>
                </div>
            </td>
            <td>
                <p className="mb-0">{(cartDetail.price * quantity).toLocaleString() + ' ₫'}</p>
            </td>
            <td>
                <button className="btn btn-md rounded-circle bg-light border" onClick={onDelete}>
                    <i className="fa fa-times text-danger"></i>
                </button>
            </td>
        </tr>
    );
};

export default CartRow;
