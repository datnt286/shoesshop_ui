import React from 'react';

interface Brand {
    id: number | null;
    name: string;
}

interface TableRowProps {
    brand: Brand;
    index: number;
    onEdit: () => void;
    onDelete: () => void;
}

const TableRow: React.FC<TableRowProps> = ({ brand, index, onEdit, onDelete }) => {
    return (
        <tr>
            <td>{index + 1}</td>
            <td>{brand.name}</td>
            <td>
                <div className="project-actions text-right">
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
