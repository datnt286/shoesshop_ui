import React from 'react';
import config from '../../../services/config';
import DefaultAvatar from '../../resources/img/default-avatar.jpg';

interface Customer {
    id: string | null;
    userName: string;
    password: string;
    name: string;
    phoneNumber: string;
    email: string;
    address: string;
    description: string;
    status: number;
    avatar: File | null;
}

interface TableRowProps {
    customer: Customer;
    index: number;
    onEdit: () => void;
    onDetail: () => void;
}

const TableRow: React.FC<TableRowProps> = ({ customer, index, onEdit, onDetail }) => {
    const avatarSrc = customer.avatar ? `${config.baseURL}/images/avatar/${customer.avatar}` : DefaultAvatar;

    return (
        <tr>
            <td>{index + 1}</td>
            <td>
                <img src={avatarSrc} className="img-thumbnail" width={50} height={50} alt="Avatar" />
            </td>
            <td>{customer.userName}</td>
            <td>{customer.name}</td>
            <td>{customer.phoneNumber}</td>
            <td>{customer.email}</td>
            <td>{customer.status === 1 ? 'Hoạt động' : 'Bị khoá'}</td>
            <td>
                <div className="project-actions text-right">
                    <button className="btn btn-info btn-sm mr-2" onClick={onDetail}>
                        <i className="fas fa-info-circle"></i>
                    </button>
                    <button className="btn btn-primary btn-sm mr-2" onClick={onEdit}>
                        <i className="fas fa-edit"></i>
                    </button>
                </div>
            </td>
        </tr>
    );
};

export default TableRow;
