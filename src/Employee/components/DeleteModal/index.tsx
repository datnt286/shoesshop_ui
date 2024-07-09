import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Swal from 'sweetalert2';
import AxiosInstance from '../../../services/AxiosInstance';

interface DeleteModalProps {
    show: boolean;
    endpoint: string;
    handleClose: () => void;
    onSuccess: () => void;
}

const DeleteModal: React.FC<DeleteModalProps> = ({ show, endpoint, handleClose, onSuccess }) => {
    const handleConfirm = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.preventDefault();

        try {
            const response = await AxiosInstance.put(endpoint);

            if (response.status === 204) {
                handleClose();
                onSuccess();

                Swal.fire({
                    title: 'Xoá dữ liệu thành công!',
                    icon: 'success',
                    toast: true,
                    position: 'top-end',
                    timerProgressBar: true,
                    showConfirmButton: false,
                    timer: 1000,
                });
            }
        } catch (error) {
            console.error('Lỗi khi xoá dữ liệu:', error);

            Swal.fire({
                title: 'Lỗi khi xoá dữ liệu!',
                icon: 'error',
                toast: true,
                position: 'top-end',
                timerProgressBar: true,
                showConfirmButton: false,
                timer: 3000,
            });
        }
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header>
                <Modal.Title>Xác nhận xoá</Modal.Title>
                <Button variant="light" className="close" onClick={handleClose} aria-label="Close">
                    <span>&times;</span>
                </Button>
            </Modal.Header>
            <Modal.Body>
                <h3>Bạn có chắc muốn xoá?</h3>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="gray" onClick={handleClose}>
                    <i className="fas fa-times-circle"></i> Huỷ
                </Button>
                <Button variant="danger" onClick={handleConfirm}>
                    <i className="fas fa-trash-alt"></i> Xác nhận
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default DeleteModal;
