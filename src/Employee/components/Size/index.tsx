import React, { useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Swal from 'sweetalert2';
import AxiosInstance from './../../../services/AxiosInstance';
import TableRow from './TableRow';
import Pagination from './../Pagination/index';
import DeleteModal from './../DeleteModal/index';
import ExportPDFButton from '../ExportPDFButton/index';

interface Size {
    id: number | null;
    name: string;
}

const Size: React.FC = () => {
    const [sizes, setSizes] = useState<Size[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedSize, setSelectedSize] = useState<Size | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [sizeData, setSizeData] = useState<Size>({
        id: null,
        name: '',
    });
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteEndpoint, setDeleteEndpoint] = useState('');
    const [deletedSuccessfully, setDeletedSuccessfully] = useState(false);

    const fetchSizes = async (currentPage = 1, pageSize = 10) => {
        try {
            const response = await AxiosInstance.get('/Sizes/paged', {
                params: {
                    currentPage,
                    pageSize,
                },
            });

            if (response.status === 200) {
                setSizes(response.data.items);
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
        fetchSizes();
    }, [deletedSuccessfully]);

    const handlePageChange = ({ selected }: { selected: number }) => {
        const currentPage = selected + 1;
        fetchSizes(currentPage);
    };

    const handleAddClick = () => {
        setModalTitle('Thêm size');
        setShowModal(true);
    };

    const handleEditClick = (size: Size) => {
        setSelectedSize(size);
        setModalTitle('Cập nhật size');
        setShowModal(true);
        setSizeData({
            ...sizeData,
            id: size.id,
            name: size.name,
        });
    };

    const handleClose = () => {
        setShowModal(false);
        setSelectedSize(null);
        resetFormData();
    };

    const handleDeleteClick = (size: Size) => {
        setDeleteEndpoint(`/Sizes/${size.id}`);
        setShowDeleteModal(true);
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;

        setSizeData({
            ...sizeData,
            [name]: value,
        });
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        try {
            if (selectedSize) {
                const response = await AxiosInstance.put(`/Sizes/${selectedSize.id}`, sizeData);

                if (response.status === 204) {
                    Swal.fire({
                        title: 'Cập nhật size thành công!',
                        icon: 'success',
                        toast: true,
                        position: 'top-end',
                        showConfirmButton: false,
                        timer: 3000,
                    });
                }
            } else {
                const { id, ...newSizeData } = sizeData;
                const response = await AxiosInstance.post('/Sizes', newSizeData);

                if (response.status === 201) {
                    Swal.fire({
                        title: 'Thêm nhãn size thành công!',
                        icon: 'success',
                        toast: true,
                        position: 'top-end',
                        showConfirmButton: false,
                        timer: 3000,
                    });
                }
            }

            fetchSizes();
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
        setSizeData({
            id: null,
            name: '',
        });
    };

    return (
        <>
            <div className="row my-4">
                <div className="col-9">
                    <h1 className="m-0">Quản lý size</h1>
                </div>
                <div className="col-3 text-right">
                    <button className="btn btn-success mt-2" onClick={handleAddClick}>
                        <i className="fas fa-plus-circle mr-1"></i> Thêm size
                    </button>
                </div>
            </div>

            <div className="card">
                <div className="card-header">
                    <ExportPDFButton data={sizes} />
                </div>
                <div className="card-body">
                    <table className="table table-bordered table-striped">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Tên</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {sizes.map((size, index) => {
                                return (
                                    <TableRow
                                        key={size.id}
                                        index={index}
                                        size={size}
                                        onEdit={() => handleEditClick(size)}
                                        onDelete={() => handleDeleteClick(size)}
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
                        <input type="hidden" name="id" id="id" value={sizeData.id || ''} />
                        <div className="form-group">
                            <label htmlFor="name">Size: </label>
                            <input
                                type="text"
                                name="name"
                                id="name"
                                className="form-control"
                                value={sizeData.name}
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

export default Size;
