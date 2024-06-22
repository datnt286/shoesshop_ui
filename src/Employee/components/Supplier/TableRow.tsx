import React from 'react';

interface Supplier {
    id: number | null;
    name: string;
    phoneNumber: string;
    email: string;
    address: string;
}

interface TableRowProps {
    supplier: Supplier;
    index: number;
    onEdit: () => void;
    onDelete: () => void;
}

const TableRow: React.FC<TableRowProps> = ({ supplier, index, onEdit, onDelete }) => {
    return (
        <tr>
            <td>{index + 1}</td>
            <td>{supplier.name}</td>
            <td>{supplier.phoneNumber}</td>
            <td>{supplier.email}</td>
            <td>{supplier.address}</td>
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
