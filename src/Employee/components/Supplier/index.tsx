import React, { useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Swal from 'sweetalert2';
import axios from 'axios';
import AxiosInstance from './../../../services/AxiosInstance';
import Pagination from './../Pagination/index';
import DeleteModal from './../DeleteModal/index';
import ExportExcelButton from './../ExportExcelButton/index';

interface Supplier {
    id: number | null;
    name: string;
    phoneNumber: string;
    email: string;
    address: string;
}

interface City {
    Id: string;
    Name: string;
    Districts: District[];
}

interface District {
    Id: string;
    Name: string;
    Wards: Ward[];
}

interface Ward {
    Id: string;
    Name: string;
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

    const [cities, setCities] = useState<City[]>([]);
    const [districts, setDistricts] = useState<District[]>([]);
    const [wards, setWards] = useState<Ward[]>([]);
    const [selectedCity, setSelectedCity] = useState<string>('');
    const [selectedDistrict, setSelectedDistrict] = useState<string>('');
    const [selectedWard, setSelectedWard] = useState<string>('');

    const [errors, setErrors] = useState<{
        name?: string;
        phoneNumber?: string;
        email?: string;
        city?: string;
        district?: string;
        ward?: string;
    }>({});

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

    useEffect(() => {
        fetch('/address_data.json')
            .then((response) => response.json())
            .then((data) => {
                setCities(data);
            })
            .catch((error) => console.error('Lỗi khi tải dữ liệu địa chỉ: ', error));
    }, []);

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

        const addressParts = supplier.address.split(',').map((part) => part.trim());
        const wardName = addressParts[0];
        const districtName = addressParts[1];
        const cityName = addressParts[2];

        const selectedCity = cities.find((city) => city.Name === cityName);
        if (selectedCity) {
            setDistricts(selectedCity.Districts);
            setSelectedCity(selectedCity.Name);

            const selectedDistrict = selectedCity.Districts.find((district) => district.Name === districtName);
            if (selectedDistrict) {
                setWards(selectedDistrict.Wards);
                setSelectedDistrict(selectedDistrict.Name);

                const selectedWard = selectedDistrict.Wards.find((ward) => ward.Name === wardName);
                if (selectedWard) {
                    setSelectedWard(selectedWard.Name);
                } else {
                    setSelectedWard('');
                }
            } else {
                setSelectedDistrict('');
                setWards([]);
                setSelectedWard('');
            }
        } else {
            setSelectedCity('');
            setDistricts([]);
            setWards([]);
            setSelectedDistrict('');
            setSelectedWard('');
        }
    };

    const handleClose = () => {
        setShowModal(false);
        setSelectedSupplier(null);
        resetFormData();
    };

    const handleDeleteClick = (id: number | null) => {
        setDeleteEndpoint(`/Suppliers/${id}`);
        setShowDeleteModal(true);
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;

        if (name === 'name') {
            if (!value) {
                setErrors((prevErrors) => ({ ...prevErrors, name: 'Tên nhà cung cấp không được để trống.' }));
            } else {
                const vietnameseCharacterRegex =
                    /^[a-zA-Z0-9àáãạảăắằẳẵặâấầẩẫậèéẹẻẽêềếểễệđìíĩỉịòóõọỏôốồổỗộơớờởỡợùúũụủưứừửữựỳỵỷỹýÀÁÃẠẢĂẮẰẲẴẶÂẤẦẨẪẬÈÉẸẺẼÊỀẾỂỄỆĐÌÍĨỈỊÒÓÕỌỎÔỐỒỔỖỘƠỚỜỞỠỢÙÚŨỤỦƯỨỪỬỮỰỲỴỶỸÝ\s]+$/;

                if (!vietnameseCharacterRegex.test(value)) {
                    setErrors((prevErrors) => ({
                        ...prevErrors,
                        name: 'Tên nhà cung cấp không được chứa ký tự đặc biệt.',
                    }));
                } else {
                    setErrors((prevErrors) => ({ ...prevErrors, name: undefined }));
                }
            }
        }

        if (name === 'phoneNumber') {
            if (!value) {
                setErrors((prevErrors) => ({ ...prevErrors, phoneNumber: 'Số điện thoại không được để trống.' }));
            } else {
                const phoneNumberRegex = /^0\d{9}$/;

                if (!phoneNumberRegex.test(value)) {
                    setErrors((prevErrors) => ({
                        ...prevErrors,
                        phoneNumber: 'Số điện thoại phải bắt đầu bằng số 0 và đủ 10 chữ số.',
                    }));
                } else {
                    setErrors((prevErrors) => ({ ...prevErrors, phoneNumber: undefined }));
                }
            }
        }

        if (name === 'email') {
            if (!value) {
                setErrors((prevErrors) => ({ ...prevErrors, email: 'Email không được để trống.' }));
            } else {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

                if (!emailRegex.test(value)) {
                    setErrors((prevErrors) => ({
                        ...prevErrors,
                        email: 'Email không hợp lệ.',
                    }));
                } else {
                    setErrors((prevErrors) => ({ ...prevErrors, email: undefined }));
                }
            }
        }

        setSupplierData({
            ...supplierData,
            [name]: value,
        });
    };

    const updateAddress = (cityName: string, districtName: string, wardName: string) => {
        const address = `${wardName ? wardName + ', ' : ''}${districtName ? districtName + ', ' : ''}${cityName}`;

        setSupplierData({
            ...supplierData,
            address,
        });
    };

    const handleCityChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const cityId = event.target.value;
        const selectedCity = cities.find((city) => city.Id === cityId);

        if (!cityId) {
            setErrors((prevErrors) => ({ ...prevErrors, city: 'Vui lòng chọn Tỉnh/Thành phố.' }));
        } else {
            setErrors((prevErrors) => ({ ...prevErrors, city: undefined }));
        }

        if (selectedCity) {
            setDistricts(selectedCity.Districts);
            setWards([]);
            setSelectedCity(selectedCity.Name);
            setSelectedDistrict('');
            setSelectedWard('');
            updateAddress(selectedCity.Name, '', '');
        } else {
            setDistricts([]);
            setWards([]);
            setSelectedCity('');
            setSelectedDistrict('');
            setSelectedWard('');
            updateAddress('', '', '');
        }
    };

    const handleDistrictChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const districtId = event.target.value;
        const selectedDistrict = districts.find((district) => district.Id === districtId);

        if (!districtId) {
            setErrors((prevErrors) => ({ ...prevErrors, district: 'Vui lòng chọn Quận/Huyện.' }));
        } else {
            setErrors((prevErrors) => ({ ...prevErrors, district: undefined }));
        }

        if (selectedDistrict) {
            setWards(selectedDistrict.Wards);
            setSelectedDistrict(selectedDistrict.Name);
            setSelectedWard('');
            updateAddress(selectedCity, selectedDistrict.Name, '');
        } else {
            setWards([]);
            setSelectedDistrict('');
            setSelectedWard('');
            updateAddress(selectedCity, '', '');
        }
    };

    const handleWardChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const wardId = event.target.value;
        const selectedWard = wards.find((ward) => ward.Id === wardId);

        if (!wardId) {
            setErrors((prevErrors) => ({ ...prevErrors, ward: 'Vui lòng chọn Phường/Xã.' }));
        } else {
            setErrors((prevErrors) => ({ ...prevErrors, ward: undefined }));
        }

        if (selectedWard) {
            setSelectedWard(selectedWard.Name);
            updateAddress(selectedCity, selectedDistrict, selectedWard.Name);
        } else {
            setSelectedWard('');
            updateAddress(selectedCity, selectedDistrict, '');
        }
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const newErrors: {
            name?: string;
            phoneNumber?: string;
            email?: string;
            city?: string;
            district?: string;
            ward?: string;
        } = {};

        if (!supplierData.name) {
            newErrors.name = 'Tên nhà cung cấp không được để trống.';
        }

        if (!supplierData.phoneNumber) {
            newErrors.phoneNumber = 'Số điện thoại không được để trống.';
        }

        if (!supplierData.email) {
            newErrors.email = 'Email không được để trống.';
        }

        if (!selectedCity) {
            newErrors.city = 'Vui lòng chọn Tỉnh/Thành phố.';
        }

        if (!selectedDistrict) {
            newErrors.district = 'Vui lòng chọn Quận/Huyện.';
        }

        if (!selectedWard) {
            newErrors.ward = 'Vui lòng chọn Phường/Xã.';
        }

        setErrors(newErrors);

        if (Object.values(newErrors).some((error) => error)) {
            return;
        }

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

            if (axios.isAxiosError(error)) {
                if (error.response && error.response.status === 409) {
                    const apiErrors = error.response.data.messages;
                    const newApiErrors: {
                        name?: string;
                        phoneNumber?: string;
                        email?: string;
                    } = {};

                    apiErrors.forEach((errorMessage: string) => {
                        if (errorMessage.includes('Name')) {
                            newApiErrors.name = 'Tên nhà cung cấp đã tồn tại.';
                        } else if (errorMessage.includes('PhoneNumber')) {
                            newApiErrors.phoneNumber = 'Số điện thoại đã tồn tại.';
                        } else if (errorMessage.includes('Email')) {
                            newApiErrors.email = 'Email đã tồn tại.';
                        }
                    });

                    setErrors(newApiErrors);
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
        setSupplierData({
            id: null,
            name: '',
            phoneNumber: '',
            email: '',
            address: '',
        });
        setSelectedCity('');
        setSelectedDistrict('');
        setSelectedWard('');
        setDistricts([]);
        setWards([]);
        setErrors({});
    };

    return (
        <>
            <div className="row my-4">
                <div className="col-9">
                    <h1 className="m-0">Quản lý nhà cung cấp</h1>
                </div>
                <div className="col-3 text-right">
                    <button className="btn btn-success mt-2" onClick={handleAddClick}>
                        <i className="fas fa-plus-circle"></i> Thêm nhà cung cấp
                    </button>
                </div>
            </div>

            <div className="card">
                <div className="card-header">
                    <ExportExcelButton endpoint="/Suppliers" filename="nha-cung-cap" />
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
                            {suppliers.map((supplier, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{supplier.name}</td>
                                    <td>{supplier.phoneNumber}</td>
                                    <td>{supplier.email}</td>
                                    <td>{supplier.address}</td>
                                    <td>
                                        <div className="project-actions text-right">
                                            <button
                                                className="btn btn-blue btn-sm mr-2"
                                                onClick={() => handleEditClick(supplier)}
                                            >
                                                <i className="fas fa-edit"></i>
                                            </button>
                                            <button
                                                className="btn btn-danger btn-sm"
                                                onClick={() => handleDeleteClick(supplier.id)}
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
                            {errors.name && <div className="text-danger">{errors.name}</div>}
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
                            {errors.phoneNumber && <div className="text-danger">{errors.phoneNumber}</div>}
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
                            {errors.email && <div className="text-danger">{errors.email}</div>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="city">Tỉnh/Thành phố</label>
                            <select
                                id="city"
                                className="form-select"
                                value={cities.find((city) => city.Name === selectedCity)?.Id || ''}
                                onChange={handleCityChange}
                            >
                                <option value="" disabled>
                                    Chọn Tỉnh/Thành phố
                                </option>
                                {cities.map((city) => (
                                    <option key={city.Id} value={city.Id}>
                                        {city.Name}
                                    </option>
                                ))}
                            </select>
                            {errors.city && <div className="text-danger">{errors.city}</div>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="district">Quận/Huyện</label>
                            <select
                                id="district"
                                className="form-select"
                                value={districts.find((district) => district.Name === selectedDistrict)?.Id || ''}
                                onChange={handleDistrictChange}
                                disabled={districts.length === 0}
                            >
                                <option value="" disabled>
                                    Chọn Quận/Huyện
                                </option>
                                {districts.map((district) => (
                                    <option key={district.Id} value={district.Id}>
                                        {district.Name}
                                    </option>
                                ))}
                            </select>
                            {errors.district && <div className="text-danger">{errors.district}</div>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="ward">Phường/Xã</label>
                            <select
                                id="ward"
                                className="form-select"
                                value={wards.find((ward) => ward.Name === selectedWard)?.Id || ''}
                                onChange={handleWardChange}
                                disabled={wards.length === 0}
                            >
                                <option value="" disabled>
                                    Chọn Phường/Xã
                                </option>
                                {wards.map((ward) => (
                                    <option key={ward.Id} value={ward.Id}>
                                        {ward.Name}
                                    </option>
                                ))}
                            </select>
                            {errors.ward && <div className="text-danger">{errors.ward}</div>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="address">Địa chỉ: </label>
                            <input
                                type="text"
                                name="address"
                                id="address"
                                className="form-control"
                                value={supplierData.address}
                                disabled
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

export default Supplier;
