import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Swal from 'sweetalert2';
import axios from 'axios';
import AxiosInstance from '../../../services/AxiosInstance';
import config from '../../../services/config';
import Pagination from '../Pagination/index';
import DeleteModal from '../DeleteModal/index';
import ExportExcelButton from './../ExportExcelButton/index';
import DefaultImage from '../../resources/img/default-image.jpg';

const ALLOWED_IMAGE_TYPES = ['image/jpg', 'image/jpeg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE = 2 * 1024 * 1024;

interface Model {
    id: number | null;
    name: string;
    productTypeId: number;
    brandId: number;
    supplierId: number;
    importPrice: number | null;
    price: number | null;
    description: string;
    status: number;
    images: File[];
}

interface ProductType {
    id: number;
    name: string;
}

interface Brand {
    id: number;
    name: string;
}

interface Supplier {
    id: number;
    name: string;
}

interface ModelProps {
    productTypeId: number;
    title: string;
}

const Model: React.FC<ModelProps> = ({ productTypeId, title }) => {
    const [models, setModels] = useState<Model[]>([]);
    const [productTypes, setProductTypes] = useState<ProductType[]>([]);
    const [brands, setBrands] = useState<Brand[]>([]);
    const [suppliers, setSupplier] = useState<Supplier[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedModel, setSelectedModel] = useState<Model | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [modelData, setModelData] = useState<Model>({
        id: null,
        name: '',
        productTypeId: 0,
        brandId: 0,
        supplierId: 0,
        importPrice: null,
        price: null,
        description: '',
        status: 1,
        images: [],
    });
    const [selectedImageFiles, setSelectedImageFiles] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteEndpoint, setDeleteEndpoint] = useState('');
    const [deletedSuccessfully, setDeletedSuccessfully] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [keyword, setKeyword] = useState('');

    const [errors, setErrors] = useState<{
        name?: string;
        productType?: string;
        brand?: string;
        supplier?: string;
        importPrice?: string;
        price?: string;
        images?: string;
    }>({});

    const fetchModels = async (currentPage = 1, pageSize = 10) => {
        try {
            const params: any = {
                currentPage,
                pageSize,
            };

            if (keyword) {
                params.keyword = keyword;
            }

            const response = await AxiosInstance.get(`/Models/paged/productType/${productTypeId}`, {
                params,
            });

            if (response.status === 200) {
                setModels(response.data.items);
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

    const fetchProductTypes = async () => {
        try {
            const response = await AxiosInstance.get('/ProductTypes/ChildProductTypes');

            if (response.status === 200) {
                setProductTypes(response.data);
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

    const fetchBrands = async () => {
        try {
            const response = await AxiosInstance.get('/Brands');

            if (response.status === 200) {
                setBrands(response.data);
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

    const fetchSuppliers = async () => {
        try {
            const response = await AxiosInstance.get('/Suppliers');

            if (response.status === 200) {
                setSupplier(response.data);
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
        fetchModels();
        fetchProductTypes();
        fetchBrands();
        fetchSuppliers();
    }, [deletedSuccessfully]);

    const handlePageChange = ({ selected }: { selected: number }) => {
        const currentPage = selected + 1;
        fetchModels(currentPage);
    };

    const handleAddClick = () => {
        setModalTitle('Thêm mẫu sản phẩm');
        setShowModal(true);
    };

    const handleEditClick = (model: Model) => {
        setSelectedModel(model);
        setModalTitle('Cập nhật mẫu sản phẩm');
        setShowModal(true);
        setModelData({
            ...modelData,
            id: model.id,
            name: model.name,
            productTypeId: model.productTypeId,
            brandId: model.brandId,
            supplierId: model.supplierId,
            importPrice: model.importPrice,
            price: model.price,
            description: model.description,
            status: model.status,
            images: [],
        });
        const existingImagePreviews = model.images.map((image) => `${config.baseURL}/images/model/${image.name}`);
        setImagePreviews(existingImagePreviews);
    };

    const handleClose = () => {
        setShowModal(false);
        setSelectedModel(null);
        resetFormData();
    };

    const handleDeleteClick = (id: number | null) => {
        setDeleteEndpoint(`/Models/SoftDelete/${id}`);
        setShowDeleteModal(true);
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = event.target;

        if (name === 'name') {
            if (!value) {
                setErrors((prevErrors) => ({ ...prevErrors, name: 'Tên mẫu sản phẩm không được để trống.' }));
            } else {
                setErrors((prevErrors) => ({ ...prevErrors, name: undefined }));
            }
        }

        if (name === 'importPrice') {
            if (!value) {
                setErrors((prevErrors) => ({ ...prevErrors, importPrice: 'Giá nhập không được để trống.' }));
            } else {
                const importPriceRegex = /^(?:[1-9]\d{0,7}|0)$/;

                if (!importPriceRegex.test(value)) {
                    setErrors((prevErrors) => ({
                        ...prevErrors,
                        importPrice: 'Giá nhập phải là số nhỏ hơn 100.000.000.',
                    }));
                } else {
                    setErrors((prevErrors) => ({ ...prevErrors, importPrice: undefined }));
                }
            }
        }

        if (name === 'price') {
            if (!value) {
                setErrors((prevErrors) => ({ ...prevErrors, price: 'Giá bán không được để trống.' }));
            } else {
                const priceRegex = /^(?:[1-9]\d{0,7}|0)$/;

                if (!priceRegex.test(value)) {
                    setErrors((prevErrors) => ({
                        ...prevErrors,
                        price: 'Giá bán phải là số nhỏ hơn 100.000.000.',
                    }));
                } else {
                    setErrors((prevErrors) => ({ ...prevErrors, price: undefined }));
                }
            }
        }

        if (name === 'productTypeId' && parseInt(value) !== 0) {
            setErrors((prevErrors) => ({ ...prevErrors, productType: undefined }));
        }

        if (name === 'brandId' && parseInt(value) !== 0) {
            setErrors((prevErrors) => ({ ...prevErrors, brand: undefined }));
        }

        if (name === 'supplierId' && parseInt(value) !== 0) {
            setErrors((prevErrors) => ({ ...prevErrors, supplier: undefined }));
        }

        setModelData({
            ...modelData,
            [name]: name === 'productTypeId' || name === 'brandId' || name === 'supplierId' ? parseInt(value) : value,
        });
    };

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;

        if (files) {
            const filesArray: File[] = Array.from(files);
            const invalidFiles = filesArray.filter(
                (file) => !ALLOWED_IMAGE_TYPES.includes(file.type) || file.size > MAX_FILE_SIZE,
            );

            if (invalidFiles.length > 0) {
                const errorMessages = invalidFiles
                    .map((file) => {
                        if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
                            return `File ${file.name} không phải là hình ảnh hợp lệ.`;
                        } else if (file.size > MAX_FILE_SIZE) {
                            return `Dung lượng file ${file.name} vượt quá 2MB.`;
                        }
                        return '';
                    })
                    .join(' ');

                setErrors((prevErrors) => ({
                    ...prevErrors,
                    images: errorMessages,
                }));

                return;
            }

            const imagesArray: string[] = [];
            const promises = filesArray.map((file) => {
                return new Promise<void>((resolve) => {
                    const reader = new FileReader();
                    reader.onload = () => {
                        imagesArray.push(reader.result as string);
                        resolve();
                    };
                    reader.readAsDataURL(file);
                });
            });

            Promise.all(promises).then(() => {
                setImagePreviews(imagesArray);
                setModelData({
                    ...modelData,
                    images: filesArray,
                });
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    images: undefined,
                }));
            });
        }
    };

    const handleImageDelete = (index: number) => {
        if (modelData.images && imagePreviews.length) {
            const updatedImageFiles = selectedImageFiles.filter((_, i) => i !== index);
            const updatedImagePreviews = imagePreviews.filter((_, i) => i !== index);

            setSelectedImageFiles(updatedImageFiles);
            setImagePreviews(updatedImagePreviews);
            setModelData({
                ...modelData,
                images: updatedImageFiles,
            });
        }
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const newErrors: {
            name?: string;
            productType?: string;
            brand?: string;
            supplier?: string;
            importPrice?: string;
            price?: string;
            images?: string;
        } = {};

        if (!modelData.name) {
            newErrors.name = 'Tên mẫu sản phẩm không được để trống.';
        }

        if (!modelData.productTypeId) {
            newErrors.productType = 'Vui lòng chọn loại sản phẩm.';
        }

        if (!modelData.brandId) {
            newErrors.brand = 'Vui lòng chọn nhãn hiệu.';
        }

        if (!modelData.supplierId) {
            newErrors.supplier = 'Vui lòng chọn nhà cung cấp.';
        }

        if (!modelData.importPrice) {
            newErrors.importPrice = 'Giá nhập không được để trống.';
        }

        if (!modelData.price) {
            newErrors.price = 'Giá bán không được để trống.';
        }

        if (errors.images) {
            newErrors.images = errors.images;
        }

        setErrors(newErrors);

        if (Object.values(newErrors).some((error) => error)) {
            return;
        }

        try {
            let formData = new FormData();
            formData.append('name', modelData.name);
            formData.append('productTypeId', modelData.productTypeId.toString());
            formData.append('brandId', modelData.brandId.toString());
            formData.append('supplierId', modelData.supplierId.toString());
            formData.append('importPrice', modelData.importPrice?.toString() || '');
            formData.append('price', modelData.price?.toString() || '');
            formData.append('description', modelData.description);
            formData.append('status', modelData.status.toString());
            if (modelData.images) {
                modelData.images.forEach((image) => {
                    formData.append('images', image);
                });
            }

            if (selectedModel && selectedModel.id) {
                formData.append('id', selectedModel.id.toString());
                const response = await AxiosInstance.put(`/Models/${selectedModel.id}`, formData);

                if (response.status === 204) {
                    Swal.fire({
                        title: 'Cập nhật mẫu sản phẩm thành công!',
                        icon: 'success',
                        toast: true,
                        position: 'top-end',
                        timerProgressBar: true,
                        showConfirmButton: false,
                        timer: 3000,
                    });
                }
            } else {
                const response = await AxiosInstance.post('/Models', formData);

                if (response.status === 201) {
                    Swal.fire({
                        title: 'Thêm mẫu sản phẩm thành công!',
                        icon: 'success',
                        toast: true,
                        position: 'top-end',
                        timerProgressBar: true,
                        showConfirmButton: false,
                        timer: 3000,
                    });
                }
            }

            fetchModels();
            resetFormData();
            handleClose();
        } catch (error) {
            console.error('Lỗi khi gửi dữ liệu:', error);

            if (axios.isAxiosError(error)) {
                if (error.response && error.response.status === 409) {
                    setErrors({ ...errors, name: 'Tên mẫu sản phẩm đã tồn tại.' });
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
        setModelData({
            id: null,
            name: '',
            productTypeId: 0,
            brandId: 0,
            supplierId: 0,
            importPrice: null,
            price: null,
            description: '',
            status: 1,
            images: [],
        });
        setImagePreviews([]);
        setErrors({});
    };

    const handleDetailClick = (model: Model) => {
        setSelectedModel(model);
        setShowDetailModal(true);
    };

    const handleCloseDetailModal = () => setShowDetailModal(false);

    const handleSearchInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setKeyword(event.target.value);
    };

    const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        fetchModels();
    };

    return (
        <>
            <div className="row my-4">
                <div className="col-9">
                    <h1 className="m-0">{title}</h1>
                </div>
                <div className="col-3 text-right">
                    <button className="btn btn-success mt-2" onClick={handleAddClick}>
                        <i className="fas fa-plus-circle"></i> Thêm mẫu sản phẩm
                    </button>
                </div>
            </div>

            <div className="card">
                <div className="card-header">
                    <ExportExcelButton
                        endpoint={`/Models/productType/${productTypeId}`}
                        filename={`${productTypeId === 1 ? 'giay' : 'phu-kien-khac'}`}
                    />
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
                                <th>Hình ảnh</th>
                                <th>Tên</th>
                                <th>Giá nhập</th>
                                <th>Giá bán</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {models.length > 0 ? (
                                models.map((model, index) => {
                                    const imageSrc =
                                        model.images && model.images.length > 0
                                            ? `${config.baseURL}/images/model/${model.images[0].name}`
                                            : DefaultImage;

                                    return (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>
                                                <img
                                                    src={imageSrc}
                                                    className="img img-thumbnail cursor-pointer"
                                                    style={{ maxWidth: '100px', maxHeight: '100px' }}
                                                    onClick={() => handleDetailClick(model)}
                                                    alt="Ảnh sản phẩm"
                                                />
                                            </td>
                                            <td>
                                                <span
                                                    className="cursor-pointer underline-on-hover"
                                                    onClick={() => handleDetailClick(model)}
                                                >
                                                    {model.name}
                                                </span>
                                            </td>
                                            <td>{model.importPrice?.toLocaleString() + ' ₫'}</td>
                                            <td>{model.price?.toLocaleString() + ' ₫'}</td>
                                            <td>
                                                <div className="project-actions text-right">
                                                    <Link to={`/admin/san-pham/${model.id}`}>
                                                        <button className="btn btn-gray btn-sm mr-2">
                                                            <i className="fas fa-list-ul"></i>
                                                        </button>
                                                    </Link>
                                                    {/* <button
                                                        className="btn btn-gray btn-sm mr-2"
                                                        onClick={() => handleDetailClick(model)}
                                                    >
                                                        <i className="fas fa-info-circle"></i>
                                                    </button> */}
                                                    <button
                                                        className="btn btn-blue btn-sm mr-2"
                                                        onClick={() => handleEditClick(model)}
                                                    >
                                                        <i className="fas fa-edit"></i>
                                                    </button>
                                                    <button
                                                        className="btn btn-danger btn-sm"
                                                        onClick={() => handleDeleteClick(model.id)}
                                                    >
                                                        <i className="fas fa-trash-alt"></i>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <h3 className="m-2">Danh sách mẫu sản phẩm trống.</h3>
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
                        <input type="hidden" name="id" id="id" value={modelData.id || ''} />
                        <div className="form-group text-center">
                            <label htmlFor="images" className="form-label d-block">
                                Ảnh mẫu sản phẩm:
                            </label>
                            <div>
                                <>
                                    {imagePreviews && imagePreviews.length > 0 ? (
                                        <>
                                            {imagePreviews.map((image, index) => (
                                                <span className="d-inline-flex flex-column align-items-center">
                                                    <img
                                                        key={index}
                                                        src={image}
                                                        className="img img-thumbnail mx-1 my-2"
                                                        style={{ maxWidth: '100px', maxHeight: '100px' }}
                                                        alt={`Ảnh sản phẩm ${index + 1}`}
                                                    />
                                                    <button
                                                        type="button"
                                                        className="btn btn-sm btn-danger my-1"
                                                        onClick={() => handleImageDelete(index)}
                                                    >
                                                        Xoá
                                                    </button>
                                                </span>
                                            ))}
                                        </>
                                    ) : (
                                        <img
                                            src={DefaultImage}
                                            className="img img-thumbnail my-2"
                                            style={{ maxWidth: '100px', maxHeight: '100px' }}
                                            alt={'Ảnh sản phẩm'}
                                        />
                                    )}
                                    {errors.images && <div className="text-danger">{errors.images}</div>}
                                </>
                            </div>
                            <input
                                type="file"
                                name="images[]"
                                id="images"
                                className="d-none"
                                onChange={handleImageChange}
                                multiple
                            />
                            <label htmlFor="images" className="btn btn-gray font-weight-normal mt-2">
                                Chọn ảnh
                            </label>
                        </div>
                        <div className="form-group">
                            <label htmlFor="name">Tên mẫu sản phẩm: </label>
                            <input
                                type="text"
                                name="name"
                                id="name"
                                className="form-control"
                                value={modelData.name}
                                onChange={handleInputChange}
                            />
                            {errors.name && <div className="text-danger">{errors.name}</div>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="product-type-id">Loại sản phẩm: </label>
                            <select
                                name="productTypeId"
                                id="product-type-id"
                                className="form-select"
                                value={modelData.productTypeId}
                                onChange={handleInputChange}
                                required
                            >
                                <option value={0} disabled>
                                    -- Chọn loại sản phẩm --
                                </option>
                                {productTypes.map((productType) => (
                                    <option key={productType.id} value={productType.id}>
                                        {productType.name}
                                    </option>
                                ))}
                            </select>
                            {errors.productType && <div className="text-danger">{errors.productType}</div>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="brand-id">Nhãn hiệu: </label>
                            <select
                                name="brandId"
                                id="brand-id"
                                className="form-select"
                                value={modelData.brandId}
                                onChange={handleInputChange}
                                required
                            >
                                <option value={0} disabled>
                                    -- Chọn nhãn hiệu --
                                </option>
                                {brands.map((brand) => (
                                    <option key={brand.id} value={brand.id}>
                                        {brand.name}
                                    </option>
                                ))}
                            </select>
                            {errors.brand && <div className="text-danger">{errors.brand}</div>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="supplier-id">Nhà cung cấp: </label>
                            <select
                                name="supplierId"
                                id="supplier-id"
                                className="form-select"
                                value={modelData.supplierId}
                                onChange={handleInputChange}
                                required
                            >
                                <option value={0} disabled>
                                    -- Chọn nhà cung cấp --
                                </option>
                                {suppliers.map((supplier) => (
                                    <option key={supplier.id} value={supplier.id}>
                                        {supplier.name}
                                    </option>
                                ))}
                            </select>
                            {errors.supplier && <div className="text-danger">{errors.supplier}</div>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="import-price">Giá nhập: </label>
                            <input
                                type="text"
                                name="importPrice"
                                id="import-price"
                                className="form-control"
                                value={modelData.importPrice || ''}
                                onChange={handleInputChange}
                            />
                            {errors.importPrice && <div className="text-danger">{errors.importPrice}</div>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="price">Giá bán: </label>
                            <input
                                type="text"
                                name="price"
                                id="price"
                                className="form-control"
                                value={modelData.price || ''}
                                onChange={handleInputChange}
                            />
                            {errors.price && <div className="text-danger">{errors.price}</div>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="description">Mô tả: </label>
                            <input
                                type="text"
                                name="description"
                                id="description"
                                className="form-control"
                                value={modelData.description}
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

            <Modal show={showDetailModal} onHide={handleCloseDetailModal}>
                <Modal.Header>
                    <Modal.Title>Chi tiết mẫu sản phẩm</Modal.Title>
                    <Button variant="light" className="close" aria-label="Close" onClick={handleCloseDetailModal}>
                        <span>&times;</span>
                    </Button>
                </Modal.Header>
                <Modal.Body>
                    {selectedModel && (
                        <>
                            <div className="text-center">
                                <div className="form-group">
                                    <span className="text-lg font-weight-bold">Ảnh mẫu sản phẩm:</span>
                                </div>
                                <div className="form-group">
                                    {selectedModel && selectedModel.images && selectedModel.images.length > 0 ? (
                                        selectedModel.images.map((image, index) => {
                                            const imageSrc = `${config.baseURL}/images/model/${image.name}`;

                                            return (
                                                <img
                                                    key={index}
                                                    src={imageSrc}
                                                    className="img img-thumbnail my-2 mr-3"
                                                    style={{ maxWidth: '100px', maxHeight: '100px' }}
                                                    alt="Ảnh sản phẩm"
                                                />
                                            );
                                        })
                                    ) : (
                                        <img
                                            src={DefaultImage}
                                            className="img img-thumbnail my-2"
                                            style={{ maxWidth: '100px', maxHeight: '100px' }}
                                            alt="Ảnh sản phẩm"
                                        />
                                    )}
                                </div>
                            </div>
                            <div className="form-group">
                                <span className="text-lg font-weight-bold">Tên mẫu sản phẩm: </span>
                                <span className="text-lg">{selectedModel.name}</span>
                            </div>
                            <div className="form-group">
                                <span className="text-lg font-weight-bold">Loại sản phẩm: </span>
                                <span className="text-lg">
                                    {
                                        productTypes.find(
                                            (productType) => productType.id === selectedModel.productTypeId,
                                        )?.name
                                    }
                                </span>
                            </div>
                            <div className="form-group">
                                <span className="text-lg font-weight-bold">Nhãn hiệu: </span>
                                <span className="text-lg">
                                    {brands.find((brand) => brand.id === selectedModel.brandId)?.name}
                                </span>
                            </div>
                            <div className="form-group">
                                <span className="text-lg font-weight-bold">Nhà cung cấp: </span>
                                <span className="text-lg">
                                    {suppliers.find((supplier) => supplier.id === selectedModel.supplierId)?.name}
                                </span>
                            </div>
                            <div className="form-group">
                                <span className="text-lg font-weight-bold">Giá nhập: </span>
                                <span className="text-lg">{selectedModel.importPrice?.toLocaleString() + ' ₫'}</span>
                            </div>
                            <div className="form-group">
                                <span className="text-lg font-weight-bold">Giá bán: </span>
                                <span className="text-lg">{selectedModel.price?.toLocaleString() + ' ₫'}</span>
                            </div>
                            <div className="form-group">
                                <span className="text-lg font-weight-bold">Mô tả: </span>
                                <span className="text-lg">{selectedModel.description}</span>
                            </div>
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="light" onClick={handleCloseDetailModal}>
                        <i className="fas fa-times-circle"></i> Đóng
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

export default Model;
