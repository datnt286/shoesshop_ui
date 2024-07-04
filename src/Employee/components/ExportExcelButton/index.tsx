import React from 'react';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import AxiosInstance from '../../../services/AxiosInstance';

interface ExportExcelButtonProps {
    endpoint: string;
    filename: string;
}

const ExportExcelButton: React.FC<ExportExcelButtonProps> = ({ endpoint, filename }) => {
    const keyMapping: { [key: string]: string } = {
        id: 'Id',
        userName: 'Tên đăng nhập',
        name: 'Tên',
        phoneNumber: 'Điện thoại',
        email: 'Email',
        address: 'Địa chỉ',
        avatar: 'Ảnh đại diện',
        role: 'Chức vụ',
        salary: 'Lương',
        image: 'Hình ảnh',
        sku: 'SKU',
        productType: 'Loại sản phẩm',
        brand: 'Nhãn hiệu',
        supplier: 'Nhà cung cấp',
        model: 'Mẫu sản phẩm',
        color: 'Màu sắc',
        size: 'Size',
        importPrice: 'Giá nhập',
        price: 'Giá bán',
        quantity: 'Số lượng',
        description: 'Mô tả',
        customerName: 'Tên khách hàng',
        paymentMethod: 'Phương thức thanh toán',
        createDate: 'Ngày đặt',
        total: 'Thành tiền',
        totalPayment: 'Tổng thành tiền',
        shippingFee: 'Phí vận chuyển',
        note: 'Ghi chú',
        status: 'Trạng thái',
    };

    const transformData = (data: any[]) => {
        return data.map((item) => {
            const newItem: any = {};
            for (const key in item) {
                if (keyMapping[key]) {
                    newItem[keyMapping[key]] = item[key];
                } else {
                    newItem[key] = item[key];
                }
            }
            return newItem;
        });
    };

    const fetchExportData = async () => {
        try {
            const response = await AxiosInstance.get(endpoint);

            if (response.status === 200) {
                return response.data;
            } else {
                throw new Error('Error fetching data');
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

            return [];
        }
    };

    const exportToExcel = async () => {
        const data = await fetchExportData();
        const transformedData = transformData(data);
        const worksheet = XLSX.utils.json_to_sheet(transformedData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet);
        XLSX.writeFile(workbook, `${filename}.xlsx`);
    };

    return (
        <button className="btn btn-gray" onClick={exportToExcel}>
            <i className="fas fa-file-excel"></i> Xuất Excel
        </button>
    );
};

export default ExportExcelButton;
