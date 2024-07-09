import React, { useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import Swal from 'sweetalert2';
import AxiosInstance from '../../../services/AxiosInstance';
import config from './../../../services/config';
import Pagination from '../Pagination/index';
import DeleteModal from '../DeleteModal/index';
import ExportExcelButton from '../ExportExcelButton/index';
import DefaultImage from '../../resources/img/default-image.jpg';

const ALLOWED_IMAGE_TYPES = ['image/jpg', 'image/jpeg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE = 2 * 1024 * 1024;

interface Slider {
    id: number | null;
    name: string;
    status: number;
    image: File | null;
}

const Slider: React.FC = () => {
    const [sliders, setSliders] = useState<Slider[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedSlider, setSelectedSlider] = useState<Slider | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [sliderData, setSliderData] = useState<Slider>({
        id: null,
        name: '',
        image: null,
        status: 1,
    });
    const [imagePreview, setImagePreview] = useState(DefaultImage);
    const [isEditMode, setIsEditMode] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteEndpoint, setDeleteEndpoint] = useState('');
    const [deletedSuccessfully, setDeletedSuccessfully] = useState(false);
    const [errors, setErrors] = useState<{
        name?: string;
        image?: string;
    }>({});

    const fetchSliders = async (currentPage = 1, pageSize = 10) => {
        try {
            const response = await AxiosInstance.get('/Sliders/paged', {
                params: {
                    currentPage,
                    pageSize,
                },
            });

            if (response.status === 200) {
                setSliders(response.data.items);
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
        fetchSliders();
    }, [deletedSuccessfully]);

    const handlePageChange = ({ selected }: { selected: number }) => {
        const currentPage = selected + 1;
        fetchSliders(currentPage);
    };

    const handleAddClick = () => {
        setModalTitle('Thêm slider');
        setShowModal(true);
        setIsEditMode(false);
    };

    const handleEditClick = (slider: Slider) => {
        const imageSrc = slider.image ? `${config.baseURL}/images/slider/${slider.image}` : DefaultImage;

        setSelectedSlider(slider);
        setModalTitle('Cập nhật slider');
        setShowModal(true);
        setIsEditMode(true);
        setSliderData({
            ...sliderData,
            id: slider.id,
            name: slider.name,
            status: slider.status,
        });
        setImagePreview(imageSrc);
    };

    const handleClose = () => {
        setShowModal(false);
        setSelectedSlider(null);
        resetFormData();
    };

    const handleDeleteClick = (id: number | null) => {
        setDeleteEndpoint(`/Sliders/${id}`);
        setShowDeleteModal(true);
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = event.target;

        if (type === 'checkbox') {
            const checkboxValue = (event.currentTarget as HTMLInputElement).checked ? 1 : 0;

            setSliderData({
                ...sliderData,
                [name]: checkboxValue,
            });
        } else {
            if (name === 'name') {
                if (!value) {
                    setErrors((prevErrors) => ({ ...prevErrors, name: 'Tên slider không được để trống.' }));
                } else {
                    setErrors((prevErrors) => ({ ...prevErrors, name: undefined }));
                }
            }

            setSliderData({
                ...sliderData,
                [name]: value,
            });
        }
    };

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];

        if (file) {
            if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    image: 'Chỉ được chọn các tệp hình ảnh (jpg, jpeg, png, webp).',
                }));
                return;
            }

            if (file.size > MAX_FILE_SIZE) {
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    image: 'Dung lượng ảnh phải nhỏ hơn 2MB.',
                }));
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
                setSliderData({
                    ...sliderData,
                    image: file,
                });
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    image: undefined,
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const newErrors: {
            name?: string;
            image?: string;
        } = {};

        if (!sliderData.name) {
            newErrors.name = 'Tên slider không được để trống.';
        }

        if (!sliderData.image && !isEditMode) {
            newErrors.image = 'Vui lòng chọn hình ảnh.';
        }

        setErrors(newErrors);

        if (Object.values(newErrors).some((error) => error)) {
            return;
        }

        try {
            const formData = new FormData();
            formData.append('name', sliderData.name);
            formData.append('status', sliderData.status.toString());
            if (sliderData.image) {
                formData.append('image', sliderData.image);
            }

            if (selectedSlider && selectedSlider.id) {
                formData.append('id', selectedSlider.id.toString());
                const response = await AxiosInstance.put(`/Sliders/${selectedSlider.id}`, formData);

                if (response.status === 204) {
                    Swal.fire({
                        title: 'Cập nhật slider thành công!',
                        icon: 'success',
                        toast: true,
                        position: 'top-end',
                        timerProgressBar: true,
                        showConfirmButton: false,
                        timer: 1000,
                    });
                }
            } else {
                const response = await AxiosInstance.post('/Sliders', formData);

                if (response.status === 201) {
                    Swal.fire({
                        title: 'Thêm slider thành công!',
                        icon: 'success',
                        toast: true,
                        position: 'top-end',
                        timerProgressBar: true,
                        showConfirmButton: false,
                        timer: 1000,
                    });
                }
            }

            fetchSliders();
            resetFormData();
            handleClose();
        } catch (error) {
            console.error('Lỗi khi gửi dữ liệu:', error);

            if (axios.isAxiosError(error)) {
                if (error.response && error.response.status === 409) {
                    setErrors({ ...errors, name: 'Tên slider đã tồn tại.' });
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

    const handleToggleStatus = async (id: number | null) => {
        try {
            const response = await AxiosInstance.put(`/Sliders/UpdateStatus/${id}`);

            if (response.status === 204) {
                fetchSliders();

                Swal.fire({
                    title: 'Cập nhật trạng thái slider thành công.',
                    icon: 'success',
                    toast: true,
                    position: 'top-end',
                    timerProgressBar: true,
                    showConfirmButton: false,
                    timer: 3000,
                });
            }
        } catch (error) {
            console.error('Lỗi khi cập nhật trạng thái slider: ', error);

            Swal.fire({
                title: 'Lỗi khi cập nhật trạng thái slider.',
                icon: 'error',
                toast: true,
                position: 'top-end',
                timerProgressBar: true,
                showConfirmButton: false,
                timer: 3000,
            });
        }
    };

    const resetFormData = () => {
        setSliderData({
            id: null,
            name: '',
            status: 1,
            image: null,
        });
        setImagePreview(DefaultImage);
        setIsEditMode(false);
        setErrors({});
    };

    return (
        <>
            <div className="row my-4">
                <div className="col-9">
                    <h1 className="m-0">Quản lý slider</h1>
                </div>
                <div className="col-3 text-right">
                    <button className="btn btn-success mt-2" onClick={handleAddClick}>
                        <i className="fas fa-plus-circle"></i> Thêm slider
                    </button>
                </div>
            </div>

            <div className="card">
                <div className="card-header">
                    <ExportExcelButton endpoint="/Sliders" filename="slider" />
                </div>
                <div className="card-body">
                    <table className="table table-bordered table-striped">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Hình ảnh</th>
                                <th>Tên</th>
                                <th>Trạng thái</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {sliders.length > 0 ? (
                                sliders.map((slider, index) => {
                                    const imageSrc = slider.image
                                        ? `${config.baseURL}/images/slider/${slider.image}`
                                        : DefaultImage;

                                    return (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>
                                                <img
                                                    src={imageSrc}
                                                    className="img img-thumbnail"
                                                    style={{ maxWidth: '100px', maxHeight: '100px' }}
                                                    alt="Hình ảnh"
                                                />
                                            </td>
                                            <td>{slider.name}</td>
                                            <td>{slider.status === 1 ? 'Đã hiện' : 'Đã ẩn'}</td>
                                            <td>
                                                <div className="project-actions text-right">
                                                    <button
                                                        className={`btn ${
                                                            slider.status === 1 ? 'btn-warning' : 'btn-success'
                                                        } btn-sm mr-2`}
                                                        onClick={() => handleToggleStatus(slider.id)}
                                                    >
                                                        <i
                                                            className={
                                                                slider.status === 1 ? 'fas fa-eye-slash' : 'fas fa-eye'
                                                            }
                                                        ></i>{' '}
                                                        {slider.status === 1 ? 'Ẩn' : 'Hiện'}
                                                    </button>
                                                    <button
                                                        className="btn btn-blue btn-sm mr-2"
                                                        onClick={() => handleEditClick(slider)}
                                                    >
                                                        <i className="fas fa-edit"></i>
                                                    </button>
                                                    <button
                                                        className="btn btn-danger btn-sm"
                                                        onClick={() => handleDeleteClick(slider.id)}
                                                    >
                                                        <i className="fas fa-trash-alt"></i>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <h3 className="m-2">Danh sách slider trống.</h3>
                            )}
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
                        <input type="hidden" name="id" id="id" value={sliderData.id || ''} />
                        <div className="form-group text-center">
                            <label htmlFor="image" className="form-label d-block">
                                Hình ảnh:
                            </label>
                            <div>
                                <img
                                    src={imagePreview}
                                    className="img img-thumbnail my-2"
                                    style={{ maxWidth: '100px', maxHeight: '100px' }}
                                    alt="Hình ảnh"
                                />
                                {errors.image && <div className="text-danger">{errors.image}</div>}
                            </div>
                            <input
                                type="file"
                                name="image"
                                id="image"
                                className="d-none"
                                onChange={handleImageChange}
                            />
                            <label htmlFor="image" className="btn btn-gray font-weight-normal mt-2">
                                Chọn ảnh
                            </label>
                        </div>
                        <div className="form-group">
                            <label htmlFor="name">Tên: </label>
                            <input
                                type="text"
                                name="name"
                                id="name"
                                className="form-control"
                                value={sliderData.name}
                                onChange={handleInputChange}
                            />
                            {errors.name && <div className="text-danger">{errors.name}</div>}
                        </div>
                        <div className="custom-control custom-checkbox text-center">
                            <input
                                type="checkbox"
                                name="status"
                                id="status"
                                className="custom-control-input"
                                onChange={handleInputChange}
                                checked={sliderData.status === 1}
                            />
                            <label htmlFor="status" className="custom-control-label">
                                Hiện
                            </label>
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

export default Slider;
