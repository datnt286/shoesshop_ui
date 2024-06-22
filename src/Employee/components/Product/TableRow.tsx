import React from 'react';
import config from '../../../services/config';
import DefaultImage from '../../resources/img/default-image.jpg';

interface Product {
    id: number | null;
    name: string;
    modelId: number | null;
    colorId: number | null;
    sizeId: number | null;
    importPrice: number | null;
    price: number | null;
    quantity: number | null;
    description: string;
    image: File | null;
}

interface Color {
    id: number;
    name: string;
}

interface Size {
    id: number;
    name: string;
}

interface TableRowProps {
    product: Product;
    colors: Color[];
    sizes: Size[];
    index: number;
    onEdit: () => void;
    onDelete: () => void;
    onDetail: () => void;
}

const TableRow: React.FC<TableRowProps> = ({ product, colors, sizes, index, onEdit, onDelete, onDetail }) => {
    const colorName = colors.find((color) => color.id === product.colorId)?.name || 'N/A';
    const sizeName = sizes.find((size) => size.id === product.sizeId)?.name || 'N/A';
    const imageSrc = product.image ? `${config.baseURL}/images/product/${product.image}` : DefaultImage;

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
            <td>{product.name}</td>
            <td>{colorName}</td>
            <td>{sizeName}</td>
            <td>{product.quantity}</td>
            <td>
                <div className="project-actions text-right">
                    <button className="btn btn-info btn-sm mr-2" onClick={onDetail}>
                        <i className="fas fa-info-circle"></i>
                    </button>
                    <button className="btn btn-primary btn-sm mr-2" onClick={onEdit}>
                        <i className="fas fa-edit"></i>
                    </button>
                    <button className="btn btn-danger btn-sm" onClick={onDelete}>
                        <i className="fas fa-trash-alt"></i>
                    </button>
                </div>
            </td>
        </tr>
    );
};

export default TableRow;
