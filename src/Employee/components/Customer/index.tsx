import React, { useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Swal from 'sweetalert2';
import AxiosInstance from '../../../services/AxiosInstance';
import config from '../../../services/config';
import TableRow from './TableRow';
import Pagination from '../Pagination/index';
import ExportPDFButton from '../ExportPDFButton/index';
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

const Customer: React.FC = () => {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [customerData, setCustomerData] = useState<Customer>({
        id: null,
        name: '',
        userName: '',
        password: '',
        phoneNumber: '',
        email: '',
        address: '',
        description: '',
        status: 1,
        avatar: null,
    });
    const [avatarPreview, setAvatarPreview] = useState(DefaultAvatar);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [keyword, setKeyword] = useState('');

    const avatarSrc = selectedCustomer?.avatar
        ? `${config.baseURL}/images/avatar/${selectedCustomer.avatar}`
        : DefaultAvatar;

    const fetchCustomers = async (currentPage = 1, pageSize = 10) => {
        try {
            const params: any = {
                currentPage,
                pageSize,
            };

            if (keyword) {
                params.keyword = keyword;
            }

            const response = await AxiosInstance.get('/Users/Customers/paged', {
                params,
            });

            if (response.status === 200) {
                setCustomers(response.data.items);
                setTotalPages(response.data.totalPages);
            }
        } catch (error) {
            console.error('Lỗi khi tải dữ liệu: ', error);

            Swal.fire({
                title: 'Lỗi khi tải dữ liệu!',
                icon: 'error',
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
            });
        }
    };

    useEffect(() => {
        fetchCustomers();
    }, []);

    const handlePageChange = ({ selected }: { selected: number }) => {
        const currentPage = selected + 1;
        fetchCustomers(currentPage);
    };

    const handleEditClick = (customer: Customer) => {
        setSelectedCustomer(customer);
        setModalTitle('Cập nhật khách hàng');
        setShowModal(true);
        setCustomerData({
            ...customerData,
            id: customer.id,
            userName: customer.userName,
            password: customer.password,
            name: customer.name,
            phoneNumber: customer.phoneNumber,
            email: customer.email,
            address: customer.address,
            description: customer.description,
            status: customer.status,
        });
        setAvatarPreview(avatarSrc);
    };

    const handleClose = () => {
        setShowModal(false);
        setSelectedCustomer(null);
        resetFormData();
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;

        setCustomerData({
            ...customerData,
            [name]: value,
        });
    };

    const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];

        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result as string);
                setCustomerData({
                    ...customerData,
                    avatar: file,
                });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        try {
            let formData = new FormData();
            formData.append('id', customerData.id ?? '');
            formData.append('userName', customerData.userName);
            formData.append('password', customerData.password);
            formData.append('name', customerData.name);
            formData.append('phoneNumber', customerData.phoneNumber);
            formData.append('email', customerData.email);
            formData.append('address', customerData.address);
            formData.append('description', customerData.description);
            formData.append('status', customerData.status.toString());
            if (customerData.avatar) {
                formData.append('avatar', customerData.avatar);
            }

            if (selectedCustomer) {
                const response = await AxiosInstance.put(`/Users/Customers/${selectedCustomer.id}`, formData);

                if (response.status === 200) {
                    Swal.fire({
                        title: 'Cập nhật khách hàng thành công!',
                        icon: 'success',
                        toast: true,
                        position: 'top-end',
                        showConfirmButton: false,
                        timer: 3000,
                    });
                }
            }

            fetchCustomers();
            resetFormData();
            handleClose();
        } catch (error) {
            console.error('Lỗi khi gửi dữ liệu:', error);

            Swal.fire({
                title: 'Lỗi khi gửi dữ liệu!',
                icon: 'error',
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
            });
        }
    };

    const resetFormData = () => {
        setCustomerData({
            id: null,
            name: '',
            userName: '',
            password: '',
            phoneNumber: '',
            email: '',
            address: '',
            description: '',
            status: 1,
            avatar: null,
        });
    };

    const handleDetailClick = (customer: Customer) => {
        setSelectedCustomer(customer);
        setShowDetailModal(true);
    };

    const handleCloseDetailModal = () => setShowDetailModal(false);

    const handleSearchInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setKeyword(event.target.value);
    };

    const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        fetchCustomers();
    };

    return (
        <>
            <div className="row my-4">
                <div className="col-9">
                    <h1 className="m-0">Quản lý khách hàng</h1>
                </div>
            </div>

            <div className="card">
                <div className="card-header">
                    <ExportPDFButton data={customers} />
                    <form className="float-right d-flex justify-content-center" onSubmit={handleSearchSubmit}>
                        <input
                            type="search"
                            className="form-control form-control-sm"
                            onChange={handleSearchInputChange}
                        />
                        <button type="submit" className="btn btn-secondary btn-sm text-nowrap ml-2">
                            <i className="fas fa-search"></i>
                        </button>
                    </form>
                </div>
                <div className="card-body">
                    <table className="table table-bordered table-striped">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Ảnh đại diện</th>
                                <th>Tên đăng nhập</th>
                                <th>Họ tên</th>
                                <th>Điện thoại</th>
                                <th>Email</th>
                                <th>Trạng thái</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {customers.map((customer, index) => {
                                return (
                                    <TableRow
                                        key={customer.id}
                                        index={index}
                                        customer={customer}
                                        onEdit={() => handleEditClick(customer)}
                                        onDetail={() => handleDetailClick(customer)}
                                    />
                                );
                            })}
                        </tbody>
                    </table>
                </div>
                <div className="card-footer clearfix">
                    <Pagination totalPages={totalPages} onPageChange={handlePageChange} />
                </div>
            </div>

            <Modal show={showModal} onHide={handleClose}>
                <form onSubmit={handleSubmit} encType="multipart/form-data">
                    <Modal.Header>
                        <Modal.Title>{modalTitle}</Modal.Title>
                        <Button variant="light" className="close" onClick={handleClose} aria-label="Close">
                            <span>&times;</span>
                        </Button>
                    </Modal.Header>
                    <Modal.Body>
                        <input type="hidden" name="id" id="id" value={customerData.id || ''} />
                        <div className="form-group text-center">
                            <label htmlFor="avatar" className="form-label d-block">
                                Ảnh đại diện:
                            </label>
                            <div>
                                <img
                                    src={avatarPreview}
                                    className="img img-thumbnail my-2"
                                    style={{ maxWidth: '100px', maxHeight: '100px' }}
                                    alt="Ảnh đại diện"
                                />
                            </div>
                            <input
                                type="file"
                                name="avatar"
                                id="avatar"
                                className="d-none"
                                onChange={handleAvatarChange}
                            />
                            <label htmlFor="avatar" className="btn btn-secondary font-weight-normal mt-2">
                                Chọn ảnh
                            </label>
                        </div>
                        <div className="form-group">
                            <label htmlFor="username">Tên đăng nhập: </label>
                            <input
                                type="text"
                                name="userName"
                                id="username"
                                className="form-control"
                                value={customerData.userName}
                                readOnly
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Mật khẩu: </label>
                            <input
                                type="password"
                                name="password"
                                id="password"
                                className="form-control"
                                value={customerData.password}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="name">Họ tên: </label>
                            <input
                                type="text"
                                name="name"
                                id="name"
                                className="form-control"
                                value={customerData.name}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="phone-number">Điện thoại: </label>
                            <input
                                type="tel"
                                name="phoneNumber"
                                id="phone-number"
                                className="form-control"
                                value={customerData.phoneNumber}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">Email: </label>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                className="form-control"
                                value={customerData.email}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="address">Địa chỉ: </label>
                            <input
                                type="text"
                                name="address"
                                id="address"
                                className="form-control"
                                value={customerData.address}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="description">Mô tả: </label>
                            <input
                                type="text"
                                name="description"
                                id="description"
                                className="form-control"
                                value={customerData.description}
                                onChange={handleInputChange}
                            />
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            <i className="fas fa-times-circle mr-1"></i>
                            Huỷ
                        </Button>
                        <Button type="submit" variant="primary">
                            <i className="fas fa-check-circle mr-1"></i>
                            Lưu
                        </Button>
                    </Modal.Footer>
                </form>
            </Modal>

            <Modal show={showDetailModal} onHide={handleCloseDetailModal}>
                <Modal.Header>
                    <Modal.Title>Chi tiết khách hàng</Modal.Title>
                    <Button variant="light" className="close" aria-label="Close" onClick={handleCloseDetailModal}>
                        <span>&times;</span>
                    </Button>
                </Modal.Header>
                <Modal.Body>
                    {selectedCustomer && (
                        <>
                            <div className="text-center">
                                <div className="form-group">
                                    <span className="text-lg font-weight-bold">Ảnh đại diện:</span>
                                </div>
                                <div className="form-group">
                                    <img
                                        src={avatarSrc}
                                        className="img img-thumbnail mb-3"
                                        style={{ maxWidth: '100px', maxHeight: '100px' }}
                                        alt="Ảnh đại diện"
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <span className="text-lg font-weight-bold">Tên đăng nhập: </span>
                                <span className="text-lg">{selectedCustomer.userName}</span>
                            </div>
                            <div className="form-group">
                                <span className="text-lg font-weight-bold">Họ tên: </span>
                                <span className="text-lg">{selectedCustomer.name}</span>
                            </div>
                            <div className="form-group">
                                <span className="text-lg font-weight-bold">Điện thoại: </span>
                                <span className="text-lg">{selectedCustomer.phoneNumber}</span>
                            </div>
                            <div className="form-group">
                                <span className="text-lg font-weight-bold">Email: </span>
                                <span className="text-lg">{selectedCustomer.email}</span>
                            </div>
                            <div className="form-group">
                                <span className="text-lg font-weight-bold">Địa chỉ: </span>
                                <span className="text-lg">{selectedCustomer.address}</span>
                            </div>
                            <div className="form-group">
                                <span className="text-lg font-weight-bold">Mô tả: </span>
                                <span className="text-lg">{selectedCustomer.description}</span>
                            </div>
                            <div className="form-group">
                                <span className="text-lg font-weight-bold">Trạng thái: </span>
                                <span className="text-lg">
                                    {selectedCustomer.status === 1 ? 'Còn hoạt động' : 'Không hoạt động'}
                                </span>
                            </div>
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseDetailModal}>
                        <i className="fas fa-times-circle mr-1"></i>
                        Đóng
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default Customer;