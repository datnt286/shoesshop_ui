import React, { useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Swal from 'sweetalert2';
import AxiosInstance from '../../../services/AxiosInstance';
import config from '../../../services/config';
import TableRow from './TableRow';
import Pagination from '../Pagination/index';
import DeleteModal from '../DeleteModal/index';
import ExportPDFButton from '../ExportPDFButton/index';
import DefaultImage from '../../resources/img/default-image.jpg';

interface Model {
    id: number | null;
    name: string;
    productTypeId: number;
    brandId: number;
    supplierId: number;
    importPrice: number | null;
    price: number | null;
    description: string;
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
        images: [],
    });
    const [selectedImageFiles, setSelectedImageFiles] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteEndpoint, setDeleteEndpoint] = useState('');
    const [deletedSuccessfully, setDeletedSuccessfully] = useState(false);
    const [keyword, setKeyword] = useState('');

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
                showConfirmButton: false,
                timer: 3000,
            });
        }
    };

    const fetchProductTypes = async () => {
        try {
            const response = await AxiosInstance.get('/ProductTypes');

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

    const handleDeleteClick = (model: Model) => {
        setDeleteEndpoint(`/Models/${model.id}`);
        setShowDeleteModal(true);
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = event.target;

        setModelData({
            ...modelData,
            [name]: name === 'productTypeId' || name === 'brandId' || name === 'supplierId' ? parseInt(value) : value,
        });
    };

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;

        if (files) {
            const filesArray: File[] = Array.from(files);

            setSelectedImageFiles(filesArray);

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

        try {
            let formData = new FormData();
            formData.append('name', modelData.name);
            formData.append('productTypeId', modelData.productTypeId.toString());
            formData.append('brandId', modelData.brandId.toString());
            formData.append('supplierId', modelData.supplierId.toString());
            formData.append('importPrice', modelData.importPrice?.toString() || '');
            formData.append('price', modelData.price?.toString() || '');
            formData.append('description', modelData.description);

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
        setModelData({
            id: null,
            name: '',
            productTypeId: 0,
            brandId: 0,
            supplierId: 0,
            importPrice: null,
            price: null,
            description: '',
            images: [],
        });
        setImagePreviews([]);
    };

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
                        <i className="fas fa-plus-circle mr-1"></i> Thêm mẫu sản phẩm
                    </button>
                </div>
            </div>

            <div className="card">
                <div className="card-header">
                    <ExportPDFButton data={models} />
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
                                <th>Hình ảnh</th>
                                <th>Tên</th>
                                <th>Giá nhập</th>
                                <th>Giá bán</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {models.map((model, index) => {
                                return (
                                    <TableRow
                                        key={model.id}
                                        index={index}
                                        model={model}
                                        onEdit={() => handleEditClick(model)}
                                        onDelete={() => handleDeleteClick(model)}
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
                        <input type="hidden" name="id" id="id" value={modelData.id || ''} />
                        <div className="form-group text-center">
                            <label htmlFor="images" className="form-label d-block">
                                Ảnh sản phẩm:
                            </label>
                            <div>
                                {imagePreviews.length > 0 ? (
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
                            </div>
                            <input
                                type="file"
                                name="images[]"
                                id="images"
                                className="d-none"
                                onChange={handleImageChange}
                                multiple
                            />
                            <label htmlFor="images" className="btn btn-secondary font-weight-normal mt-2">
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
                        </div>
                        <div className="form-group">
                            <label htmlFor="product-type-id">Loại sản phẩm: </label>
                            <select
                                name="productTypeId"
                                id="product-type-id"
                                className="form-control"
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
                        </div>
                        <div className="form-group">
                            <label htmlFor="brand-id">Thương hiệu: </label>
                            <select
                                name="brandId"
                                id="brand-id"
                                className="form-control"
                                value={modelData.brandId}
                                onChange={handleInputChange}
                                required
                            >
                                <option value={0} disabled>
                                    -- Chọn thương hiệu --
                                </option>
                                {brands.map((brand) => (
                                    <option key={brand.id} value={brand.id}>
                                        {brand.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="supplier-id">Nhà cung cấp: </label>
                            <select
                                name="supplierId"
                                id="supplier-id"
                                className="form-control"
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
                        </div>
                        <div className="form-group">
                            <label htmlFor="import-price">Giá bán: </label>
                            <input
                                type="text"
                                name="price"
                                id="price"
                                className="form-control"
                                value={modelData.price || ''}
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
                                value={modelData.description}
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

export default Model;
