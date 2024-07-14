import React, { useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import Swal from 'sweetalert2';
import AxiosInstance from '../../../services/AxiosInstance';
import Pagination from '../Pagination/index';
import DeleteModal from '../DeleteModal/index';
import ExportExcelButton from './../ExportExcelButton/index';

interface ProductType {
    id: number | null;
    name: string;
    parentProductTypeId: number;
    status: number;
}

const ProductType: React.FC = () => {
    const [productTypes, setProductTypes] = useState<ProductType[]>([]);
    const [parentProductTypes, setParentProductTypes] = useState<ProductType[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedProductType, setSelectedProductType] = useState<ProductType | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [productTypeData, setProductTypeData] = useState<ProductType>({
        id: null,
        name: '',
        parentProductTypeId: 0,
        status: 1,
    });
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteEndpoint, setDeleteEndpoint] = useState('');
    const [deletedSuccessfully, setDeletedSuccessfully] = useState(false);
    const [errors, setErrors] = useState<{
        name?: string;
        parentProductType?: string;
    }>({});

    const fetchProductTypes = async (currentPage = 1, pageSize = 10) => {
        try {
            const response = await AxiosInstance.get('/ProductTypes/paged', {
                params: {
                    currentPage,
                    pageSize,
                },
            });

            if (response.status === 200) {
                setProductTypes(response.data.items);
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

    const fetchParentProductTypes = async () => {
        try {
            const response = await AxiosInstance.get('/ProductTypes/ParentProductTypes');

            if (response.status === 200) {
                setParentProductTypes(response.data);
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
        fetchProductTypes();
    }, [deletedSuccessfully]);

    useEffect(() => {
        fetchParentProductTypes();
    }, []);

    const handlePageChange = ({ selected }: { selected: number }) => {
        const currentPage = selected + 1;
        fetchProductTypes(currentPage);
    };

    const handleAddClick = () => {
        setModalTitle('Thêm loại sản phẩm');
        setShowModal(true);
    };

    const handleEditClick = (productType: ProductType) => {
        setSelectedProductType(productType);
        setModalTitle('Cập nhật loại sản phẩm');
        setShowModal(true);
        setProductTypeData({
            ...productTypeData,
            id: productType.id,
            name: productType.name,
            parentProductTypeId: productType.parentProductTypeId,
            status: productType.status,
        });
    };

    const handleClose = () => {
        setShowModal(false);
        setSelectedProductType(null);
        resetFormData();
    };

    const handleDeleteClick = (id: number | null) => {
        setDeleteEndpoint(`/ProductTypes/SoftDelete/${id}`);
        setShowDeleteModal(true);
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = event.target;

        if (name === 'name') {
            if (!value) {
                setErrors((prevErrors) => ({ ...prevErrors, name: 'Tên loại sản phẩm không được để trống.' }));
            } else {
                const vietnameseCharacterRegex =
                    /^[a-zA-ZàáãạảăắằẳẵặâấầẩẫậèéẹẻẽêềếểễệđìíĩỉịòóõọỏôốồổỗộơớờởỡợùúũụủưứừửữựỳỵỷỹýÀÁÃẠẢĂẮẰẲẴẶÂẤẦẨẪẬÈÉẸẺẼÊỀẾỂỄỆĐÌÍĨỈỊÒÓÕỌỎÔỐỒỔỖỘƠỚỜỞỠỢÙÚŨỤỦƯỨỪỬỮỰỲỴỶỸÝ\s]+$/;

                if (!vietnameseCharacterRegex.test(value)) {
                    setErrors((prevErrors) => ({
                        ...prevErrors,
                        name: 'Tên loại sản phẩm không được chứa số và ký tự đặc biệt.',
                    }));
                } else {
                    setErrors((prevErrors) => ({ ...prevErrors, name: undefined }));
                }
            }
        }

        if (name === 'parentProductTypeId' && parseInt(value) !== 0) {
            setErrors((prevErrors) => ({ ...prevErrors, parentProductType: undefined }));
        }

        setProductTypeData({
            ...productTypeData,
            [name]: value,
        });
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const newErrors: {
            name?: string;
            parentProductType?: string;
        } = { ...errors };

        if (!productTypeData.name) {
            newErrors.name = 'Tên loại sản phẩm không được để trống.';
        }

        if (!productTypeData.parentProductTypeId) {
            newErrors.parentProductType = 'Vui lòng chọn phân loại sản phẩm.';
        }

        setErrors(newErrors);

        if (Object.values(newErrors).some((error) => error)) {
            return;
        }

        try {
            if (selectedProductType) {
                const response = await AxiosInstance.put(`/ProductTypes/${selectedProductType.id}`, productTypeData);

                if (response.status === 204) {
                    Swal.fire({
                        title: 'Cập nhật loại sản phẩm thành công!',
                        icon: 'success',
                        toast: true,
                        position: 'top-end',
                        timerProgressBar: true,
                        showConfirmButton: false,
                        timer: 1000,
                    });
                }
            } else {
                const { id, ...newProductTypeData } = productTypeData;
                const response = await AxiosInstance.post('/ProductTypes', newProductTypeData);

                if (response.status === 201) {
                    Swal.fire({
                        title: 'Thêm loại sản phẩm thành công!',
                        icon: 'success',
                        toast: true,
                        position: 'top-end',
                        timerProgressBar: true,
                        showConfirmButton: false,
                        timer: 1000,
                    });
                }
            }

            fetchProductTypes();
            resetFormData();
            handleClose();
        } catch (error) {
            console.error('Lỗi khi gửi dữ liệu:', error);

            if (axios.isAxiosError(error)) {
                if (error.response && error.response.status === 409) {
                    setErrors({ ...errors, name: 'Tên loại sản phẩm đã tồn tại.' });
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
        setProductTypeData({
            id: null,
            name: '',
            parentProductTypeId: 0,
            status: 1,
        });
        setErrors({});
    };

    return (
        <>
            <div className="row my-4">
                <div className="col-9">
                    <h1 className="m-0">Quản lý loại sản phẩm</h1>
                </div>
                <div className="col-3 text-right">
                    <button className="btn btn-success mt-2" onClick={handleAddClick}>
                        <i className="fas fa-plus-circle"></i> Thêm loại sản phẩm
                    </button>
                </div>
            </div>

            <div className="card">
                <div className="card-header">
                    <ExportExcelButton endpoint="/ProductTypes" filename="loai-san-pham" />
                </div>
                <div className="card-body">
                    <table className="table table-bordered table-striped">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Tên</th>
                                <th>Phân loại sản phẩm</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {productTypes.length > 0 ? (
                                productTypes.map((productType, index) => {
                                    const parentProductTypeName =
                                        parentProductTypes.find(
                                            (parentProductType) =>
                                                parentProductType.id === productType.parentProductTypeId,
                                        )?.name || 'N/A';

                                    return (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{productType.name}</td>
                                            <td>{parentProductTypeName}</td>
                                            <td>
                                                <div className="project-actions text-right">
                                                    <button
                                                        className="btn btn-blue btn-sm mr-2"
                                                        onClick={() => handleEditClick(productType)}
                                                    >
                                                        <i className="fas fa-edit"></i>
                                                    </button>
                                                    <button
                                                        className="btn btn-danger btn-sm"
                                                        onClick={() => handleDeleteClick(productType.id)}
                                                    >
                                                        <i className="fas fa-trash-alt"></i>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <h3 className="m-2">Danh sách loại sản phẩm trống.</h3>
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
                        <input type="hidden" name="id" id="id" value={productTypeData.id || ''} />
                        <div className="form-group">
                            <label htmlFor="name">Loại sản phẩm: </label>
                            <input
                                type="text"
                                name="name"
                                id="name"
                                className="form-control"
                                value={productTypeData.name}
                                onChange={handleInputChange}
                            />
                            {errors.name && <div className="text-danger">{errors.name}</div>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="parent-product-type-id">Phân loại sản phẩm: </label>
                            <select
                                name="parentProductTypeId"
                                id="parent-product-type-id"
                                className="form-select"
                                value={productTypeData.parentProductTypeId || 0}
                                onChange={handleInputChange}
                            >
                                <option value={0} disabled>
                                    -- Chọn phân loại sản phẩm --
                                </option>
                                {parentProductTypes.map((parentProductType) => (
                                    <option key={parentProductType.id} value={parentProductType.id || 0}>
                                        {parentProductType.name}
                                    </option>
                                ))}
                            </select>
                            {errors.parentProductType && <div className="text-danger">{errors.parentProductType}</div>}
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

export default ProductType;
