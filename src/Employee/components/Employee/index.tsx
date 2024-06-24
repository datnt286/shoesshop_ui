import React, { useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Swal from 'sweetalert2';
import AxiosInstance from './../../../services/AxiosInstance';
import config from '../../../services/config';
import Pagination from './../Pagination/index';
import DeleteModal from './../DeleteModal/index';
import ExportPDFButton from '../ExportPDFButton/index';
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

const Employee: React.FC = () => {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [employeeData, setEmployeeData] = useState<Employee>({
        id: null,
        name: '',
        userName: '',
        password: '',
        phoneNumber: '',
        email: '',
        address: '',
        roleId: 0,
        salary: 0,
        description: '',
        status: 1,
        avatar: null,
    });
    const [avatarPreview, setAvatarPreview] = useState(DefaultAvatar);
    const [isEditMode, setIsEditMode] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteEndpoint, setDeleteEndpoint] = useState('');
    const [deletedSuccessfully, setDeletedSuccessfully] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [keyword, setKeyword] = useState('');

    const avatarSrc = selectedEmployee?.avatar
        ? `${config.baseURL}/images/avatar/${selectedEmployee.avatar}`
        : DefaultAvatar;

    const fetchEmployees = async (currentPage = 1, pageSize = 10) => {
        try {
            const params: any = {
                currentPage,
                pageSize,
            };

            if (keyword) {
                params.keyword = keyword;
            }

            const response = await AxiosInstance.get('/Users/Employees/paged', {
                params,
            });

            if (response.status === 200) {
                setEmployees(response.data.items);
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
        fetchEmployees();
    }, [deletedSuccessfully]);

    const handlePageChange = ({ selected }: { selected: number }) => {
        const currentPage = selected + 1;
        fetchEmployees(currentPage);
    };

    const handleAddClick = () => {
        setModalTitle('Thêm nhân viên');
        setShowModal(true);
        setIsEditMode(false);
    };

    const handleEditClick = (employee: Employee) => {
        setSelectedEmployee(employee);
        setModalTitle('Cập nhật nhân viên');
        setShowModal(true);
        setIsEditMode(true);

        setEmployeeData({
            ...employeeData,
            id: employee.id,
            userName: employee.userName,
            password: employee.password,
            name: employee.name,
            phoneNumber: employee.phoneNumber,
            email: employee.email,
            address: employee.address,
            roleId: employee.roleId,
            salary: employee.salary,
            description: employee.description,
            status: employee.status,
            avatar: null,
        });

        const avatarUrl = employee.avatar ? `${config.baseURL}/images/avatar/${employee.avatar}` : DefaultAvatar;

        setAvatarPreview(avatarUrl);
    };

    const handleClose = () => {
        setShowModal(false);
        setSelectedEmployee(null);
        resetFormData();
    };

    const handleDeleteClick = (id: string | null) => {
        setDeleteEndpoint(`/Users/Employees/${id}`);
        setShowDeleteModal(true);
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, type } = event.target;
        let value: string | number | boolean = '';

        if (type === 'checkbox') {
            value = (event.target as HTMLInputElement).checked ? 1 : 0;
        } else {
            value = event.target.value;
        }

        setEmployeeData({
            ...employeeData,
            [name]: value,
        });
    };

    const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];

        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result as string);
                setEmployeeData({
                    ...employeeData,
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
            formData.append('userName', employeeData.userName);
            formData.append('password', employeeData.password);
            formData.append('name', employeeData.name);
            formData.append('phoneNumber', employeeData.phoneNumber);
            formData.append('email', employeeData.email);
            formData.append('address', employeeData.address);
            formData.append('description', employeeData.description);
            formData.append('salary', employeeData.salary.toString());
            formData.append('status', employeeData.status.toString());
            if (employeeData.avatar) {
                formData.append('avatar', employeeData.avatar);
            }

            if (selectedEmployee && selectedEmployee.id) {
                formData.append('id', selectedEmployee.id);
                const response = await AxiosInstance.put(`Users/Employees/${selectedEmployee.id}`, formData);

                if (response.status === 200) {
                    Swal.fire({
                        title: 'Cập nhật nhân viên thành công!',
                        icon: 'success',
                        toast: true,
                        position: 'top-end',
                        showConfirmButton: false,
                        timer: 3000,
                    });
                }
            } else {
                const response = await AxiosInstance.post('Users/Employees', formData);

                if (response.status === 200) {
                    Swal.fire({
                        title: 'Thêm nhân viên thành công!',
                        icon: 'success',
                        toast: true,
                        position: 'top-end',
                        showConfirmButton: false,
                        timer: 3000,
                    });
                }
            }

            fetchEmployees();
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
        setEmployeeData({
            id: '',
            name: '',
            userName: '',
            password: '',
            phoneNumber: '',
            email: '',
            address: '',
            roleId: 1,
            salary: 0,
            description: '',
            status: 1,
            avatar: null,
        });
        setAvatarPreview(DefaultAvatar);
    };

    const handleDetailClick = (employee: Employee) => {
        setSelectedEmployee(employee);
        setShowDetailModal(true);
    };

    const handleCloseDetailModal = () => setShowDetailModal(false);

    const handleSearchInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setKeyword(event.target.value);
    };

    const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        fetchEmployees();
    };

    return (
        <>
            <div className="row my-4">
                <div className="col-9">
                    <h1 className="m-0">Quản lý nhân viên</h1>
                </div>
                <div className="col-3 text-right">
                    <button className="btn btn-success mt-2" onClick={handleAddClick}>
                        <i className="fas fa-plus-circle mr-1"></i> Thêm nhân viên
                    </button>
                </div>
            </div>

            <div className="card">
                <div className="card-header">
                    <ExportPDFButton data={employees} />
                    <form className="float-right d-flex justify-content-center" onSubmit={handleSearchSubmit}>
                        <input
                            type="search"
                            className="form-control form-control-sm"
                            onChange={handleSearchInputChange}
                        />
                        <button type="submit" className="btn btn-gray btn-sm text-nowrap ml-2">
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
                            {employees.map((employee, index) => {
                                const avatarSrc = employee.avatar
                                    ? `${config.baseURL}/images/avatar/${employee.avatar}`
                                    : DefaultAvatar;

                                return (
                                    <tr>
                                        <td>{index + 1}</td>
                                        <td>
                                            <img
                                                src={avatarSrc}
                                                className="img-thumbnail"
                                                width={50}
                                                height={50}
                                                alt="Avatar"
                                            />
                                        </td>
                                        <td>{employee.userName}</td>
                                        <td>{employee.name}</td>
                                        <td>{employee.phoneNumber}</td>
                                        <td>{employee.email}</td>
                                        <td>{employee.status === 1 ? 'Hoạt động' : 'Không hoạt động'}</td>
                                        <td>
                                            <button
                                                className="btn btn-gray btn-sm mr-2"
                                                onClick={() => handleDetailClick(employee)}
                                            >
                                                <i className="fas fa-info-circle"></i>
                                            </button>
                                            <button
                                                className="btn btn-blue btn-sm mr-2"
                                                onClick={() => handleEditClick(employee)}
                                            >
                                                <i className="fas fa-edit"></i>
                                            </button>
                                            <button
                                                className="btn btn-danger btn-sm"
                                                onClick={() => handleDeleteClick(employee.id)}
                                            >
                                                <i className="fas fa-trash-alt"></i>
                                            </button>
                                        </td>
                                    </tr>
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
                        <input type="hidden" name="id" id="id" value={employeeData.id || ''} />
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
                            <label htmlFor="avatar" className="btn btn-gray font-weight-normal mt-2">
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
                                value={employeeData.userName}
                                onChange={handleInputChange}
                                readOnly={isEditMode}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Mật khẩu: </label>
                            <input
                                type="password"
                                name="password"
                                id="password"
                                className="form-control"
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
                                value={employeeData.name}
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
                                value={employeeData.phoneNumber}
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
                                value={employeeData.email}
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
                                value={employeeData.address}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="address">Lương: </label>
                            <input
                                type="text"
                                name="salary"
                                id="salary"
                                className="form-control"
                                value={employeeData.salary}
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
                                value={employeeData.description}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="custom-control custom-checkbox text-center">
                            <input
                                type="checkbox"
                                name="status"
                                id="status"
                                className="custom-control-input"
                                onChange={handleInputChange}
                                checked={employeeData.status === 1}
                            />
                            <label htmlFor="status" className="custom-control-label">
                                Còn hoạt động
                            </label>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="gray" onClick={handleClose}>
                            <i className="fas fa-times-circle mr-1"></i>
                            Huỷ
                        </Button>
                        <Button type="submit" variant="blue">
                            <i className="fas fa-check-circle mr-1"></i>
                            Lưu
                        </Button>
                    </Modal.Footer>
                </form>
            </Modal>

            <Modal show={showDetailModal} onHide={handleCloseDetailModal}>
                <Modal.Header>
                    <Modal.Title>Chi tiết nhân viên</Modal.Title>
                    <Button variant="light" className="close" aria-label="Close" onClick={handleCloseDetailModal}>
                        <span>&times;</span>
                    </Button>
                </Modal.Header>
                <Modal.Body>
                    {selectedEmployee && (
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
                                <span className="text-lg">{selectedEmployee.userName}</span>
                            </div>
                            <div className="form-group">
                                <span className="text-lg font-weight-bold">Họ tên: </span>
                                <span className="text-lg">{selectedEmployee.name}</span>
                            </div>
                            <div className="form-group">
                                <span className="text-lg font-weight-bold">Điện thoại: </span>
                                <span className="text-lg">{selectedEmployee.phoneNumber}</span>
                            </div>
                            <div className="form-group">
                                <span className="text-lg font-weight-bold">Email: </span>
                                <span className="text-lg">{selectedEmployee.email}</span>
                            </div>
                            <div className="form-group">
                                <span className="text-lg font-weight-bold">Địa chỉ: </span>
                                <span className="text-lg">{selectedEmployee.address}</span>
                            </div>
                            <div className="form-group">
                                <span className="text-lg font-weight-bold">Lương: </span>
                                <span className="text-lg">{selectedEmployee.salary}</span>
                            </div>
                            <div className="form-group">
                                <span className="text-lg font-weight-bold">Mô tả: </span>
                                <span className="text-lg">{selectedEmployee.description}</span>
                            </div>
                            <div className="form-group">
                                <span className="text-lg font-weight-bold">Trạng thái: </span>
                                <span className="text-lg">
                                    {selectedEmployee.status === 1 ? 'Còn hoạt động' : 'Không hoạt động'}
                                </span>
                            </div>
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="gray" onClick={handleCloseDetailModal}>
                        <i className="fas fa-times-circle mr-1"></i>
                        Đóng
                    </Button>
                </Modal.Footer>
            </Modal>

            <DeleteModal
                show={showDeleteModal}
                endpoint={deleteEndpoint}
                handleClose={() => setShowDeleteModal(false)}
                onSuccess={() => setDeletedSuccessfully(!deletedSuccessfully)}
            />
        </>
    );
};

export default Employee;
