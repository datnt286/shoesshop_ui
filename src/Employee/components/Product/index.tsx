import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
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

interface Product {
    id: number | null;
    name: string;
    modelId: number | null;
    colorId: number | null;
    sizeId: number | null;
    importPrice: number | null;
    price: number | null;
    quantity: number | null;
    description: string;
    image: File | null;
}

interface Model {
    id: number;
    name: string;
    importPrice: number;
    price: number;
    images: Image[];
}

interface Image {
    id: number;
    name: string;
    modelId: number;
}

interface Color {
    id: number;
    name: string;
}

interface Size {
    id: number;
    name: string;
}

const Product: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [model, setModel] = useState<Model | null>(null);
    const [colors, setColors] = useState<Color[]>([]);
    const [sizes, setSizes] = useState<Size[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [productData, setProductData] = useState<Product>({
        id: null,
        name: model?.name || '',
        modelId: model?.id || null,
        colorId: 0,
        sizeId: 0,
        importPrice: model?.importPrice || null,
        price: model?.price || null,
        quantity: null,
        description: '',
        image: null,
    });
    const [imagePreview, setImagePreview] = useState(DefaultImage);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteEndpoint, setDeleteEndpoint] = useState('');
    const [deletedSuccessfully, setDeletedSuccessfully] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [keyword, setKeyword] = useState('');
    const { modelId } = useParams();

    const [errors, setErrors] = useState<{
        name?: string;
        color?: string;
        size?: string;
        importPrice?: string;
        price?: string;
        quantity?: string;
        image?: string;
    }>({});

    const imageSrc = selectedProduct?.image
        ? `${config.baseURL}/images/product/${selectedProduct.image}`
        : DefaultImage;

    const imageModelSrc = model?.images ? `${config.baseURL}/images/model/${model.images[0].name}` : DefaultImage;

    const fetchProducts = async (currentPage = 1, pageSize = 10) => {
        try {
            const params: any = {
                currentPage,
                pageSize,
            };

            if (keyword) {
                params.keyword = keyword;
            }

            const response = await AxiosInstance.get(`/Products/paged/model/${modelId}`, {
                params,
            });

            if (response.status === 200) {
                setProducts(response.data.items);
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

    const fetchModel = async () => {
        try {
            const response = await AxiosInstance.get(`/Models/${modelId}`);

            if (response.status === 200) {
                setModel(response.data);
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

    const fetchColors = async () => {
        try {
            const response = await AxiosInstance.get('/Colors');

            if (response.status === 200) {
                setColors(response.data);
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

    const fetchSizes = async () => {
        try {
            const response = await AxiosInstance.get('/Sizes');

            if (response.status === 200) {
                setSizes(response.data);
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
        fetchModel();
        fetchProducts();
        fetchColors();
        fetchSizes();
    }, [deletedSuccessfully]);

    useEffect(() => {
        setProductData({
            ...productData,
            modelId: model?.id || null,
            name: model?.name + ' - ',
            importPrice: model?.importPrice || null,
            price: model?.price || null,
        });
    }, [model]);

    const handlePageChange = ({ selected }: { selected: number }) => {
        const currentPage = selected + 1;
        fetchProducts(currentPage);
    };

    const handleAddClick = () => {
        setModalTitle('Thêm sản phẩm');
        setShowModal(true);
    };

    const handleEditClick = (product: Product) => {
        const imageSrc = product.image ? `${config.baseURL}/images/product/${product.image}` : DefaultImage;

        setSelectedProduct(product);
        setModalTitle('Cập nhật sản phẩm');
        setShowModal(true);
        setProductData({
            ...productData,
            id: product.id,
            name: product.name,
            modelId: product.modelId,
            colorId: product.colorId,
            sizeId: product.sizeId,
            importPrice: product.importPrice,
            price: product.price,
            quantity: product.quantity,
            description: product.description,
        });
        setImagePreview(imageSrc);
    };

    const handleClose = () => {
        setShowModal(false);
        setSelectedProduct(null);
        resetFormData();
    };

    const handleDeleteClick = (id: number | null) => {
        setDeleteEndpoint(`/Products/${id}`);
        setShowDeleteModal(true);
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = event.target;

        let updatedProductData = {
            ...productData,
            [name]: name === 'colorId' || name === 'sizeId' ? parseInt(value) : value,
        };

        if (name === 'colorId' || name === 'sizeId') {
            const selectedColorName =
                name === 'colorId'
                    ? colors.find((color) => color.id === parseInt(value))?.name || ''
                    : colors.find((color) => color.id === updatedProductData.colorId)?.name || '';
            const selectedSizeName =
                name === 'sizeId'
                    ? sizes.find((size) => size.id === parseInt(value))?.name || ''
                    : sizes.find((size) => size.id === updatedProductData.sizeId)?.name || '';

            const baseName = model?.name || '';
            updatedProductData.name = `${baseName} - ${selectedColorName} - ${selectedSizeName}`.trim();
        }

        if (name === 'name') {
            if (!value) {
                setErrors((prevErrors) => ({ ...prevErrors, name: 'Tên sản phẩm không được để trống.' }));
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

        if (name === 'quantity') {
            if (!value) {
                setErrors((prevErrors) => ({ ...prevErrors, quantity: 'Số lượng không được để trống.' }));
            } else {
                const quantityRegex = /^[0-9]+$/;

                if (!quantityRegex.test(value)) {
                    setErrors((prevErrors) => ({
                        ...prevErrors,
                        quantity: 'Số lượng phải là số.',
                    }));
                } else {
                    setErrors((prevErrors) => ({ ...prevErrors, quantity: undefined }));
                }
            }
        }

        if (name === 'colorId' && parseInt(value) !== 0) {
            setErrors((prevErrors) => ({ ...prevErrors, color: undefined }));
        }

        if (name === 'sizeId' && parseInt(value) !== 0) {
            setErrors((prevErrors) => ({ ...prevErrors, size: undefined }));
        }

        setProductData(updatedProductData);
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
                setProductData({
                    ...productData,
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
            color?: string;
            size?: string;
            importPrice?: string;
            price?: string;
            quantity?: string;
            image?: string;
        } = {};

        if (!productData.name) {
            newErrors.name = 'Tên sản phẩm không được để trống.';
        }

        if (!productData.colorId) {
            newErrors.color = 'Vui lòng chọn màu sắc.';
        }

        if (!productData.sizeId) {
            newErrors.size = 'Vui lòng chọn size.';
        }

        if (!productData.importPrice) {
            newErrors.importPrice = 'Giá nhập không được để trống.';
        }

        if (!productData.price) {
            newErrors.price = 'Giá bán không được để trống.';
        }

        if (!productData.quantity) {
            newErrors.quantity = 'Số lượng không được để trống.';
        }

        if (errors.image) {
            newErrors.image = errors.image;
        }

        setErrors(newErrors);

        if (Object.values(newErrors).some((error) => error)) {
            return;
        }

        try {
            const formData = new FormData();
            formData.append('name', productData.name);
            formData.append('modelId', productData.modelId!.toString());
            formData.append('colorId', productData.colorId!.toString());
            formData.append('sizeId', productData.sizeId!.toString());
            formData.append('importPrice', productData.importPrice!.toString());
            formData.append('price', productData.price!.toString());
            formData.append('quantity', productData.quantity!.toString());
            formData.append('description', productData.description);
            if (productData.image) {
                formData.append('image', productData.image);
            }

            if (selectedProduct && selectedProduct.id) {
                formData.append('id', selectedProduct.id.toString());
                const response = await AxiosInstance.put(`/Products/${selectedProduct.id}`, formData);

                if (response.status === 204) {
                    Swal.fire({
                        title: 'Cập nhật sản phẩm thành công!',
                        icon: 'success',
                        toast: true,
                        position: 'top-end',
                        showConfirmButton: false,
                        timer: 3000,
                    });
                }
            } else {
                const response = await AxiosInstance.post('/Products', formData);

                if (response.status === 201) {
                    Swal.fire({
                        title: 'Thêm sản phẩm thành công!',
                        icon: 'success',
                        toast: true,
                        position: 'top-end',
                        showConfirmButton: false,
                        timer: 3000,
                    });
                }
            }

            fetchProducts();
            resetFormData();
            handleClose();
        } catch (error) {
            console.error('Lỗi khi gửi dữ liệu:', error);

            if (axios.isAxiosError(error)) {
                if (error.response && error.response.status === 409) {
                    const apiError = error.response.data.message;

                    if (apiError.includes('A product with the same ModelId, ColorId, and SizeId already exists.')) {
                        setErrors({ ...errors, name: 'Sản phẩm với cùng mẫu sản phẩm, màu sắc, size đã tồn tại.' });
                    } else if (apiError.includes('Product name already exists.')) {
                        setErrors({ ...errors, name: 'Tên sản phẩm đã tồn tại.' });
                    }
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
        setProductData({
            id: null,
            name: model?.name || '',
            modelId: model?.id || null,
            colorId: 0,
            sizeId: 0,
            importPrice: model?.importPrice || null,
            price: model?.price || null,
            quantity: null,
            description: '',
            image: null,
        });
        setImagePreview(DefaultImage);
        setErrors({});
    };

    const handleDetailClick = (product: Product) => {
        setSelectedProduct(product);
        setShowDetailModal(true);
    };

    const handleCloseDetailModal = () => setShowDetailModal(false);

    const handleSearchInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setKeyword(event.target.value);
    };

    const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        fetchProducts();
    };

    return (
        <>
            <div className="row my-4">
                <div className="col-9">
                    <div className="d-flex align-items-center">
                        <img
                            src={imageModelSrc}
                            className="img img-thumbnail"
                            style={{ maxWidth: '100px', maxHeight: '100px' }}
                            alt="Ảnh sản phẩm"
                        />
                        <span className="h1 mx-3">{model?.name}</span>
                    </div>
                </div>
                <div className="col-3 d-flex justify-content-end align-items-center">
                    <button className="btn btn-success" onClick={handleAddClick}>
                        <i className="fas fa-plus-circle"></i> Thêm sản phẩm
                    </button>
                </div>
            </div>

            <div className="card">
                <div className="card-header">
                    <ExportExcelButton endpoint="/Products" filename="san-pham" />
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
                                <th>Màu</th>
                                <th>Size</th>
                                <th>Số lượng</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.length > 0 ? (
                                products.map((product, index) => {
                                    const colorName =
                                        colors.find((color) => color.id === product.colorId)?.name || 'N/A';
                                    const sizeName = sizes.find((size) => size.id === product.sizeId)?.name || 'N/A';
                                    const imageSrc = product.image
                                        ? `${config.baseURL}/images/product/${product.image}`
                                        : DefaultImage;

                                    return (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>
                                                <img
                                                    src={imageSrc}
                                                    className="img img-thumbnail"
                                                    style={{ maxWidth: '100px', maxHeight: '100px' }}
                                                    alt="Ảnh sản phẩm"
                                                />
                                            </td>
                                            <td>{product.name}</td>
                                            <td>{colorName}</td>
                                            <td>{sizeName}</td>
                                            <td>{product.quantity}</td>
                                            <td>
                                                <div className="project-actions text-right">
                                                    <button
                                                        className="btn btn-gray btn-sm mr-2"
                                                        onClick={() => handleDetailClick(product)}
                                                    >
                                                        <i className="fas fa-info-circle"></i>
                                                    </button>
                                                    <button
                                                        className="btn btn-blue btn-sm mr-2"
                                                        onClick={() => handleEditClick(product)}
                                                    >
                                                        <i className="fas fa-edit"></i>
                                                    </button>
                                                    <button
                                                        className="btn btn-danger btn-sm"
                                                        onClick={() => handleDeleteClick(product.id)}
                                                    >
                                                        <i className="fas fa-trash-alt"></i>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <h3 className="m-2">Danh sách sản phẩm trống.</h3>
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
                        <input type="hidden" name="id" id="id" value={productData.id || ''} />
                        <div className="form-group text-center">
                            <label htmlFor="image" className="form-label d-block">
                                Ảnh sản phẩm:
                            </label>
                            <div>
                                <img
                                    src={imagePreview}
                                    className="img img-thumbnail my-2"
                                    style={{ maxWidth: '100px', maxHeight: '100px' }}
                                    alt="Ảnh sản phẩm"
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
                            <span className="text-lg font-weight-bold">Mẫu sản phẩm: </span>
                            <span className="text-lg">{model?.name}</span>
                        </div>
                        <div className="form-group">
                            <label htmlFor="name">Tên sản phẩm: </label>
                            <input
                                type="text"
                                name="name"
                                id="name"
                                className="form-control"
                                value={productData.name}
                                onChange={handleInputChange}
                            />
                            {errors.name && <div className="text-danger">{errors.name}</div>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="color-id">Màu sắc: </label>
                            <select
                                name="colorId"
                                id="color-id"
                                className="form-select"
                                value={productData.colorId || 0}
                                onChange={handleInputChange}
                                required
                            >
                                <option value={0} disabled>
                                    -- Chọn màu sắc --
                                </option>
                                {colors.map((color) => (
                                    <option key={color.id} value={color.id}>
                                        {color.name}
                                    </option>
                                ))}
                            </select>
                            {errors.color && <div className="text-danger">{errors.color}</div>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="size-id">Size: </label>
                            <select
                                name="sizeId"
                                id="size-id"
                                className="form-select"
                                value={productData.sizeId || 0}
                                onChange={handleInputChange}
                                required
                            >
                                <option value={0} disabled>
                                    -- Chọn size --
                                </option>
                                {sizes.map((size) => (
                                    <option key={size.id} value={size.id}>
                                        {size.name}
                                    </option>
                                ))}
                            </select>
                            {errors.size && <div className="text-danger">{errors.size}</div>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="import-price">Giá nhập: </label>
                            <input
                                type="text"
                                name="importPrice"
                                id="import-price"
                                className="form-control"
                                value={productData.importPrice || ''}
                                onChange={handleInputChange}
                            />
                            {errors.importPrice && <div className="text-danger">{errors.importPrice}</div>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="import-price">Giá bán: </label>
                            <input
                                type="text"
                                name="price"
                                id="price"
                                className="form-control"
                                value={productData.price || ''}
                                onChange={handleInputChange}
                            />
                            {errors.price && <div className="text-danger">{errors.price}</div>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="quantity">Số lượng: </label>
                            <input
                                type="text"
                                name="quantity"
                                id="quantity"
                                className="form-control"
                                value={productData.quantity || ''}
                                onChange={handleInputChange}
                            />
                            {errors.quantity && <div className="text-danger">{errors.quantity}</div>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="description">Mô tả: </label>
                            <input
                                type="text"
                                name="description"
                                id="description"
                                className="form-control"
                                value={productData.description}
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
                    <Modal.Title>Chi tiết sản phẩm</Modal.Title>
                    <Button variant="light" className="close" aria-label="Close" onClick={handleCloseDetailModal}>
                        <span>&times;</span>
                    </Button>
                </Modal.Header>
                <Modal.Body>
                    {selectedProduct && (
                        <>
                            <div className="text-center">
                                <div className="form-group">
                                    <span className="text-lg font-weight-bold">Ảnh sản phẩm:</span>
                                </div>
                                <div className="form-group">
                                    <img
                                        src={imageSrc}
                                        className="img img-thumbnail mb-3"
                                        style={{ maxWidth: '100px', maxHeight: '100px' }}
                                        alt="Ảnh sản phẩm"
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <span className="text-lg font-weight-bold">Tên sản phẩm: </span>
                                <span className="text-lg">{selectedProduct.name}</span>
                            </div>
                            <div className="form-group">
                                <span className="text-lg font-weight-bold">Mẫu sản phẩm: </span>
                                <span className="text-lg">{model?.name}</span>
                            </div>
                            <div className="form-group">
                                <span className="text-lg font-weight-bold">Màu sắc: </span>
                                <span className="text-lg">
                                    {colors.find((color) => color.id === selectedProduct.colorId)?.name}
                                </span>
                            </div>
                            <div className="form-group">
                                <span className="text-lg font-weight-bold">Size: </span>
                                <span className="text-lg">
                                    {sizes.find((size) => size.id === selectedProduct.sizeId)?.name}
                                </span>
                            </div>
                            <div className="form-group">
                                <span className="text-lg font-weight-bold">Giá nhập: </span>
                                <span className="text-lg">{selectedProduct.importPrice?.toLocaleString() + ' ₫'}</span>
                            </div>
                            <div className="form-group">
                                <span className="text-lg font-weight-bold">Giá bán: </span>
                                <span className="text-lg">{selectedProduct.price?.toLocaleString() + ' ₫'}</span>
                            </div>
                            <div className="form-group">
                                <span className="text-lg font-weight-bold">Số lượng: </span>
                                <span className="text-lg">{selectedProduct.quantity}</span>
                            </div>
                            <div className="form-group">
                                <span className="text-lg font-weight-bold">Mô tả: </span>
                                <span className="text-lg">{selectedProduct.description}</span>
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

export default Product;
