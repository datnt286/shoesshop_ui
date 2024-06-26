import React, { useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Swal from 'sweetalert2';
import axios from 'axios';
import AxiosInstance from './../../../services/AxiosInstance';
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
    const [errors, setErrors] = useState<{ name?: string; uniqueName?: string }>({});

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

    const handleDeleteClick = (id: number | null) => {
        setDeleteEndpoint(`/Sizes/${id}`);
        setShowDeleteModal(true);
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;

        if (name === 'name') {
            if (!value) {
                setErrors((prevErrors) => ({ ...prevErrors, name: 'Tên size không được để trống.' }));
            } else {
                const numberRegex = /^(3[0-9]|4[0-9]|50)$/;

                if (!numberRegex.test(value)) {
                    setErrors((prevErrors) => ({
                        ...prevErrors,
                        name: 'Tên size chỉ được chứa số từ 30 tới 50.',
                    }));
                } else {
                    setErrors((prevErrors) => ({ ...prevErrors, name: undefined }));
                }
            }
        }

        if (errors.uniqueName) {
            setErrors((prevErrors) => ({ ...prevErrors, uniqueName: undefined }));
        }

        setSizeData({
            ...sizeData,
            [name]: value,
        });
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!sizeData.name) {
            setErrors((prevErrors) => ({ ...prevErrors, name: 'Tên size không được để trống.' }));
            return;
        }

        if (errors.name) {
            return;
        }

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
                        title: 'Thêm size thành công!',
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

            if (axios.isAxiosError(error)) {
                if (error.response && error.response.status === 409) {
                    setErrors({ ...errors, uniqueName: 'Tên size đã tồn tại.' });
                } else {
                    Swal.fire({
                        title: 'Lỗi khi gửi dữ liệu!',
                        icon: 'error',
                        toast: true,
                        position: 'top-end',
                        showConfirmButton: false,
                        timer: 3000,
                    });
                }
            } else {
                Swal.fire({
                    title: 'Lỗi không xác định!',
                    icon: 'error',
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 3000,
                });
            }
        }
    };

    const resetFormData = () => {
        setSizeData({
            id: null,
            name: '',
        });
        setErrors({});
    };

    return (
        <>
            <div className="row my-4">
                <div className="col-9">
                    <h1 className="m-0">Quản lý size</h1>
                </div>
                <div className="col-3 text-right">
                    <button className="btn btn-success mt-2" onClick={handleAddClick}>
                        <i className="fas fa-plus-circle"></i> Thêm size
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
                            {sizes.map((size, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{size.name}</td>
                                    <td>
                                        <div className="project-actions text-right">
                                            <button
                                                className="btn btn-blue btn-sm mr-2"
                                                onClick={() => handleEditClick(size)}
                                            >
                                                <i className="fas fa-edit"></i>
                                            </button>
                                            <button
                                                className="btn btn-danger btn-sm"
                                                onClick={() => handleDeleteClick(size.id)}
                                            >
                                                <i className="fas fa-trash-alt"></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
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
                            {errors.name && <div className="text-danger">{errors.name}</div>}
                            {errors.uniqueName && <div className="text-danger">{errors.uniqueName}</div>}
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="gray" onClick={handleClose}>
                            <i className="fas fa-times-circle"></i> Huỷ
                        </Button>
                        <Button type="submit" variant="blue">
                            <i className="fas fa-check-circle"></i> Lưu
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
