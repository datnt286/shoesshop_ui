import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

const Navbar: React.FC = () => {
    const [show, setShow] = useState(false);
    const navigate = useNavigate();

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleLogout = () => {
        localStorage.removeItem('employeeToken');
        navigate('/admin/dang-nhap');
    };

    return (
        <>
            <nav className="main-header navbar navbar-expand navbar-white navbar-light h-auto">
                <ul className="navbar-nav">
                    <li className="nav-item">
                        <a href="#" className="nav-link" data-widget="pushmenu" role="button">
                            <i className="fas fa-bars"></i>
                        </a>
                    </li>
                </ul>
                <ul className="navbar-nav ml-auto">
                    <li className="nav-item">
                        <a href="#" className="nav-link" role="button" onClick={handleShow}>
                            <i className="fas fa-sign-out-alt"></i>
                        </a>
                    </li>
                </ul>
            </nav>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header>
                    <Modal.Title>Xác nhận đăng xuất</Modal.Title>
                    <Button variant="light" className="close" onClick={handleClose} aria-label="Close">
                        <span>&times;</span>
                    </Button>
                </Modal.Header>
                <Modal.Body>
                    <h3>Bạn có chắc muốn đăng xuất?</h3>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="gray" onClick={handleClose}>
                        <i className="fas fa-times-circle"></i> Huỷ
                    </Button>
                    <Button variant="danger" onClick={handleLogout}>
                        <i className="fas fa-sign-out-alt"></i> Xác nhận
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default Navbar;
