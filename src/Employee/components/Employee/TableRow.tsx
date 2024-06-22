import React from 'react';
import config from '../../../services/config';
import DefaultAvatar from '../../resources/img/default-avatar.jpg';

interface Employee {
    id: string | null;
    userName: string;
    password: string;
    name: string;
    phoneNumber: string;
    email: string;
    address: string;
    roleId: number;
    salary: number;
    description: string;
    status: number;
    avatar: File | null;
}

interface TableRowProps {
    employee: Employee;
    index: number;
    onEdit: () => void;
    onDelete: () => void;
    onDetail: () => void;
}

const TableRow: React.FC<TableRowProps> = ({ employee, index, onEdit, onDelete, onDetail }) => {
    const avatarSrc = employee.avatar ? `${config.baseURL}/images/avatar/${employee.avatar}` : DefaultAvatar;

    return (
        <tr>
            <td>{index + 1}</td>
            <td>
                <img src={avatarSrc} className="img-thumbnail" width={50} height={50} alt="Avatar" />
            </td>
            <td>{employee.userName}</td>
            <td>{employee.name}</td>
            <td>{employee.phoneNumber}</td>
            <td>{employee.email}</td>
            <td>{employee.status === 1 ? 'Hoạt động' : 'Không hoạt động'}</td>
            <td>
                <button className="btn btn-info btn-sm mr-2" onClick={onDetail}>
                    <i className="fas fa-info-circle"></i>
                </button>
                <button className="btn btn-primary btn-sm mr-2" onClick={onEdit}>
                    <i className="fas fa-edit"></i>
                </button>
                <button className="btn btn-danger btn-sm" onClick={onDelete}>
                    <i className="fas fa-trash-alt"></i>
                </button>
            </td>
        </tr>
    );
};

export default TableRow;
