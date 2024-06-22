import React from 'react';
import { Link } from 'react-router-dom';
import config from '../../../services/config';
import DefaultImage from '../../resources/img/default-image.jpg';

interface Model {
    id: number | null;
    name: string;
    productTypeId: number;
    brandId: number;
    supplierId: number;
    importPrice: number | null;
    price: number | null;
    description: string;
    images: File[];
}

interface TableRowProps {
    model: Model;
    index: number;
    onEdit: () => void;
    onDelete: () => void;
}

const TableRow: React.FC<TableRowProps> = ({ model, index, onEdit, onDelete }) => {
    const imageSrc =
        model.images && model.images.length > 0
            ? `${config.baseURL}/images/model/${model.images[0].name}`
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
            <td>{model.name}</td>
            <td>{model.importPrice?.toLocaleString() + ' ₫'}</td>
            <td>{model.price?.toLocaleString() + ' ₫'}</td>
            <td>
                <div className="project-actions text-right">
                    <Link to={`/san-pham/${model.id}`}>
                        <button className="btn btn-info btn-sm mr-2">
                            <i className="fas fa-info-circle"></i>
                        </button>
                    </Link>
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
