import React, { useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Swal from 'sweetalert2';
import AxiosInstance from './../../../services/AxiosInstance';
import Pagination from './../Pagination/index';
import DeleteModal from './../DeleteModal/index';
import ExportPDFButton from '../ExportPDFButton/index';

interface Brand {
    id: number | null;
    name: string;
}

const Brand: React.FC = () => {
    const [brands, setBrands] = useState<Brand[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [brandData, setBrandData] = useState<Brand>({
        id: null,
        name: '',
    });
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteEndpoint, setDeleteEndpoint] = useState('');
    const [deletedSuccessfully, setDeletedSuccessfully] = useState(false);

    const fetchBrands = async (currentPage = 1, pageSize = 10) => {
        try {
            const response = await AxiosInstance.get('/Brands/paged', {
                params: {
                    currentPage,
                    pageSize,
                },
            });

            if (response.status === 200) {
                setBrands(response.data.items);
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
        fetchBrands();
    }, [deletedSuccessfully]);

    const handlePageChange = ({ selected }: { selected: number }) => {
        const currentPage = selected + 1;
        fetchBrands(currentPage);
    };

    const handleAddClick = () => {
        setModalTitle('Thêm nhãn hiệu');
        setShowModal(true);
    };

    const handleEditClick = (brand: Brand) => {
        setSelectedBrand(brand);
        setModalTitle('Cập nhật nhãn hiệu');
        setShowModal(true);
        setBrandData({
            ...brandData,
            id: brand.id,
            name: brand.name,
        });
    };

    const handleClose = () => {
        setShowModal(false);
        setSelectedBrand(null);
        resetFormData();
    };

    const handleDeleteClick = (id: number | null) => {
        setDeleteEndpoint(`/Brands/${id}`);
        setShowDeleteModal(true);
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;

        setBrandData({
            ...brandData,
            [name]: value,
        });
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        try {
            if (selectedBrand) {
                const response = await AxiosInstance.put(`/Brands/${selectedBrand.id}`, brandData);

                if (response.status === 204) {
                    Swal.fire({
                        title: 'Cập nhật nhãn hiệu thành công!',
                        icon: 'success',
                        toast: true,
                        position: 'top-end',
                        showConfirmButton: false,
                        timer: 3000,
                    });
                }
            } else {
                const { id, ...newBrandData } = brandData;
                const response = await AxiosInstance.post('/Brands', newBrandData);

                if (response.status === 201) {
                    Swal.fire({
                        title: 'Thêm nhãn hiệu thành công!',
                        icon: 'success',
                        toast: true,
                        position: 'top-end',
                        showConfirmButton: false,
                        timer: 3000,
                    });
                }
            }

            fetchBrands();
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
        setBrandData({
            id: null,
            name: '',
        });
    };

    return (
        <>
            <div className="row my-4">
                <div className="col-9">
                    <h1 className="m-0">Quản lý nhãn hiệu</h1>
                </div>
                <div className="col-3 text-right">
                    <button className="btn btn-success mt-2" onClick={handleAddClick}>
                        <i className="fas fa-plus-circle"></i> Thêm nhãn hiệu
                    </button>
                </div>
            </div>

            <div className="card">
                <div className="card-header">
                    <ExportPDFButton data={brands} />
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
                            {brands.map((brand, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{brand.name}</td>
                                    <td>
                                        <div className="project-actions text-right">
                                            <button
                                                className="btn btn-blue btn-sm mr-2"
                                                onClick={() => handleEditClick(brand)}
                                            >
                                                <i className="fas fa-edit"></i>
                                            </button>
                                            <button
                                                className="btn btn-danger btn-sm"
                                                onClick={() => handleDeleteClick(brand.id)}
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
                        <input type="hidden" name="id" id="id" value={brandData.id || ''} />
                        <div className="form-group">
                            <label htmlFor="name">Nhãn hiệu: </label>
                            <input
                                type="text"
                                name="name"
                                id="name"
                                className="form-control"
                                value={brandData.name}
                                onChange={handleInputChange}
                            />
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

export default Brand;
