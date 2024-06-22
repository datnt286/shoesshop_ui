import React, { useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Swal from 'sweetalert2';
import AxiosInstance from './../../../services/AxiosInstance';
import TableRow from './TableRow';
import Pagination from './../Pagination/index';
import DeleteModal from './../DeleteModal/index';
import ExportPDFButton from '../ExportPDFButton/index';

interface Supplier {
    id: number | null;
    name: string;
    phoneNumber: string;
    email: string;
    address: string;
}

const Supplier: React.FC = () => {
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [supplierData, setSupplierData] = useState<Supplier>({
        id: null,
        name: '',
        phoneNumber: '',
        email: '',
        address: '',
    });
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteEndpoint, setDeleteEndpoint] = useState('');
    const [deletedSuccessfully, setDeletedSuccessfully] = useState(false);

    const fetchSuppliers = async (currentPage = 1, pageSize = 10) => {
        try {
            const response = await AxiosInstance.get('/Suppliers/paged', {
                params: {
                    currentPage,
                    pageSize,
                },
            });

            if (response.status === 200) {
                setSuppliers(response.data.items);
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
        fetchSuppliers();
    }, [deletedSuccessfully]);

    const handlePageChange = ({ selected }: { selected: number }) => {
        const currentPage = selected + 1;
        fetchSuppliers(currentPage);
    };

    const handleAddClick = () => {
        setModalTitle('Thêm nhà cung cấp');
        setShowModal(true);
    };

    const handleEditClick = (supplier: Supplier) => {
        setSelectedSupplier(supplier);
        setModalTitle('Cập nhật nhà cung cấp');
        setShowModal(true);
        setSupplierData({
            ...supplierData,
            id: supplier.id,
            name: supplier.name,
            phoneNumber: supplier.phoneNumber,
            email: supplier.email,
            address: supplier.address,
        });
    };

    const handleClose = () => {
        setShowModal(false);
        setSelectedSupplier(null);
        resetFormData();
    };

    const handleDeleteClick = (supplier: Supplier) => {
        setDeleteEndpoint(`/Suppliers/${supplier.id}`);
        setShowDeleteModal(true);
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;

        setSupplierData({
            ...supplierData,
            [name]: value,
        });
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        try {
            if (selectedSupplier) {
                const response = await AxiosInstance.put(`/Suppliers/${selectedSupplier.id}`, supplierData);

                if (response.status === 204) {
                    Swal.fire({
                        title: 'Cập nhật nhà cung cấp thành công!',
                        icon: 'success',
                        toast: true,
                        position: 'top-end',
                        showConfirmButton: false,
                        timer: 3000,
                    });
                }
            } else {
                const { id, ...newSupplierData } = supplierData;
                const response = await AxiosInstance.post('/Suppliers', newSupplierData);

                if (response.status === 201) {
                    Swal.fire({
                        title: 'Thêm nhà cung cấp thành công!',
                        icon: 'success',
                        toast: true,
                        position: 'top-end',
                        showConfirmButton: false,
                        timer: 3000,
                    });
                }
            }

            fetchSuppliers();
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
        setSupplierData({
            id: null,
            name: '',
            phoneNumber: '',
            email: '',
            address: '',
        });
    };

    return (
        <>
            <div className="row my-4">
                <div className="col-9">
                    <h1 className="m-0">Quản lý nhà cung cấp</h1>
                </div>
                <div className="col-3 text-right">
                    <button className="btn btn-success mt-2" onClick={handleAddClick}>
                        <i className="fas fa-plus-circle mr-1"></i> Thêm nhà cung cấp
                    </button>
                </div>
            </div>

            <div className="card">
                <div className="card-header">
                    <ExportPDFButton data={suppliers} />
                </div>
                <div className="card-body">
                    <table className="table table-bordered table-striped">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Tên</th>
                                <th>Điện thoại</th>
                                <th>Email</th>
                                <th>Địa chỉ</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {suppliers.map((supplier, index) => {
                                return (
                                    <TableRow
                                        key={supplier.id}
                                        index={index}
                                        supplier={supplier}
                                        onEdit={() => handleEditClick(supplier)}
                                        onDelete={() => handleDeleteClick(supplier)}
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
                <form onSubmit={handleSubmit}>
                    <Modal.Header>
                        <Modal.Title>{modalTitle}</Modal.Title>
                        <Button variant="light" className="close" onClick={handleClose} aria-label="Close">
                            <span>&times;</span>
                        </Button>
                    </Modal.Header>
                    <Modal.Body>
                        <input type="hidden" name="id" id="id" value={supplierData.id || ''} />
                        <div className="form-group">
                            <label htmlFor="name">Tên nhà cung cấp: </label>
                            <input
                                type="text"
                                name="name"
                                id="name"
                                className="form-control"
                                value={supplierData.name}
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
                                value={supplierData.phoneNumber}
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
                                value={supplierData.email}
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
                                value={supplierData.address}
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

            <DeleteModal
                show={showDeleteModal}
                endpoint={deleteEndpoint}
                handleClose={() => setShowDeleteModal(false)}
                onSuccess={() => setDeletedSuccessfully(!deletedSuccessfully)}
            />
        </>
    );
};

export default Supplier;
