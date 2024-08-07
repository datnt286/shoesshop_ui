import React, { useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import Swal from 'sweetalert2';
import AxiosInstance from './../../../services/AxiosInstance';
import Pagination from './../Pagination/index';
import DeleteModal from './../DeleteModal/index';
import ExportExcelButton from './../ExportExcelButton/index';

interface Color {
    id: number | null;
    name: string;
    status: number;
}

const Color: React.FC = () => {
    const [colors, setColors] = useState<Color[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedColor, setSelectedColor] = useState<Color | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [colorData, setColorData] = useState<Color>({
        id: null,
        name: '',
        status: 1,
    });
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteEndpoint, setDeleteEndpoint] = useState('');
    const [deletedSuccessfully, setDeletedSuccessfully] = useState(false);
    const [errors, setErrors] = useState<{ name?: string }>({});

    const fetchColors = async (currentPage = 1, pageSize = 10) => {
        try {
            const response = await AxiosInstance.get('/Colors/paged', {
                params: {
                    currentPage,
                    pageSize,
                },
            });

            if (response.status === 200) {
                setColors(response.data.items);
                setTotalPages(response.data.totalPages);
            }
        } catch (error) {
            console.error('Lỗi khi tải dữ liệu: ', error);

            Swal.fire({
                title: 'Lỗi khi tải dữ liệu!',
                icon: 'error',
                toast: true,
                position: 'top-end',
                timerProgressBar: true,
                showConfirmButton: false,
                timer: 3000,
            });
        }
    };

    useEffect(() => {
        fetchColors();
    }, [deletedSuccessfully]);

    const handlePageChange = ({ selected }: { selected: number }) => {
        const currentPage = selected + 1;
        fetchColors(currentPage);
    };

    const handleAddClick = () => {
        setModalTitle('Thêm màu sắc');
        setShowModal(true);
    };

    const handleEditClick = (color: Color) => {
        setSelectedColor(color);
        setModalTitle('Cập nhật màu sắc');
        setShowModal(true);
        setColorData({
            ...colorData,
            id: color.id,
            name: color.name,
            status: color.status,
        });
    };

    const handleClose = () => {
        setShowModal(false);
        setSelectedColor(null);
        resetFormData();
    };

    const handleDeleteClick = (id: number | null) => {
        setDeleteEndpoint(`/Colors/SoftDelete/${id}`);
        setShowDeleteModal(true);
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;

        if (name === 'name') {
            if (!value) {
                setErrors((prevErrors) => ({ ...prevErrors, name: 'Tên màu sắc không được để trống.' }));
            } else {
                const vietnameseCharacterRegex =
                    /^[a-zA-ZàáãạảăắằẳẵặâấầẩẫậèéẹẻẽêềếểễệđìíĩỉịòóõọỏôốồổỗộơớờởỡợùúũụủưứừửữựỳỵỷỹýÀÁÃẠẢĂẮẰẲẴẶÂẤẦẨẪẬÈÉẸẺẼÊỀẾỂỄỆĐÌÍĨỈỊÒÓÕỌỎÔỐỒỔỖỘƠỚỜỞỠỢÙÚŨỤỦƯỨỪỬỮỰỲỴỶỸÝ\s]+$/;

                if (!vietnameseCharacterRegex.test(value)) {
                    setErrors((prevErrors) => ({
                        ...prevErrors,
                        name: 'Tên màu sắc không được chứa số và ký tự đặc biệt.',
                    }));
                } else {
                    setErrors((prevErrors) => ({ ...prevErrors, name: undefined }));
                }
            }
        }

        setColorData({
            ...colorData,
            [name]: value,
        });
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!colorData.name) {
            setErrors((prevErrors) => ({ ...prevErrors, name: 'Tên màu sắc không được để trống.' }));
            return;
        }

        if (errors.name) {
            return;
        }

        try {
            if (selectedColor) {
                const response = await AxiosInstance.put(`/Colors/${selectedColor.id}`, colorData);

                if (response.status === 204) {
                    Swal.fire({
                        title: 'Cập nhật màu sắc thành công!',
                        icon: 'success',
                        toast: true,
                        position: 'top-end',
                        timerProgressBar: true,
                        showConfirmButton: false,
                        timer: 1000,
                    });
                }
            } else {
                const { id, ...newColorData } = colorData;
                const response = await AxiosInstance.post('/Colors', newColorData);

                if (response.status === 201) {
                    Swal.fire({
                        title: 'Thêm màu sắc thành công!',
                        icon: 'success',
                        toast: true,
                        position: 'top-end',
                        timerProgressBar: true,
                        showConfirmButton: false,
                        timer: 1000,
                    });
                }
            }

            fetchColors();
            resetFormData();
            handleClose();
        } catch (error) {
            console.error('Lỗi khi gửi dữ liệu:', error);

            if (axios.isAxiosError(error)) {
                if (error.response && error.response.status === 409) {
                    setErrors({ ...errors, name: 'Tên màu sắc đã tồn tại.' });
                } else {
                    Swal.fire({
                        title: 'Lỗi khi gửi dữ liệu!',
                        icon: 'error',
                        toast: true,
                        position: 'top-end',
                        timerProgressBar: true,
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
                    timerProgressBar: true,
                    showConfirmButton: false,
                    timer: 3000,
                });
            }
        }
    };

    const resetFormData = () => {
        setColorData({
            id: null,
            name: '',
            status: 1,
        });
        setErrors({});
    };

    return (
        <>
            <div className="row my-4">
                <div className="col-9">
                    <h1 className="m-0">Quản lý màu sắc</h1>
                </div>
                <div className="col-3 text-right">
                    <button className="btn btn-success mt-2" onClick={handleAddClick}>
                        <i className="fas fa-plus-circle"></i> Thêm màu sắc
                    </button>
                </div>
            </div>

            <div className="card">
                <div className="card-header">
                    <ExportExcelButton endpoint="/Colors" filename="mau-sac" />
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
                            {colors.length > 0 ? (
                                colors.map((color, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{color.name}</td>
                                        <td>
                                            <div className="project-actions text-right">
                                                <button
                                                    className="btn btn-blue btn-sm mr-2"
                                                    onClick={() => handleEditClick(color)}
                                                >
                                                    <i className="fas fa-edit"></i>
                                                </button>
                                                <button
                                                    className="btn btn-danger btn-sm"
                                                    onClick={() => handleDeleteClick(color.id)}
                                                >
                                                    <i className="fas fa-trash-alt"></i>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <h3 className="m-2">Danh sách màu sắc trống.</h3>
                            )}
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
                        <input type="hidden" name="id" id="id" value={colorData.id || ''} />
                        <div className="form-group">
                            <label htmlFor="name">Màu sắc: </label>
                            <input
                                type="text"
                                name="name"
                                id="name"
                                className="form-control"
                                value={colorData.name}
                                onChange={handleInputChange}
                            />
                            {errors.name && <div className="text-danger">{errors.name}</div>}
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

export default Color;
