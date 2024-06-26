import React, { useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Swal from 'sweetalert2';
import AxiosInstance from './../../../services/AxiosInstance';
import Pagination from './../Pagination/index';

interface Comment {
    id: number | null;
    userId: string;
    customerUserName: string;
    customerName: string;
    parentCommentId: number | null;
    content: string;
    createDate: string;
    status: number;
    comments: Comment[];
}

const Comment: React.FC = () => {
    const [comments, setComments] = useState<Comment[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedComment, setSelectedComment] = useState<Comment | null>(null);
    const [showModal, setShowModal] = useState(false);

    const fetchComments = async (currentPage = 1, pageSize = 10) => {
        try {
            const response = await AxiosInstance.get('/Comments/paged', {
                params: {
                    currentPage,
                    pageSize,
                },
            });

            if (response.status === 200) {
                setComments(response.data.items);
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
        fetchComments();
    }, []);

    const handlePageChange = ({ selected }: { selected: number }) => {
        const currentPage = selected + 1;
        fetchComments(currentPage);
    };

    const handleDetailClick = (comment: Comment) => {
        setSelectedComment(comment);
        setShowModal(true);
    };

    const handleClose = () => {
        setShowModal(false);
        setSelectedComment(null);
    };

    return (
        <>
            <div className="row my-4">
                <div className="col-12">
                    <h1 className="m-0">Quản lý bình luận</h1>
                </div>
            </div>

            <div className="card">
                <div className="card-header"></div>
                <div className="card-body">
                    <table className="table table-bordered table-striped">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Tên khách hàng</th>
                                <th>Nội dung</th>
                                <th>Thời gian</th>
                                <th>Trạng thái</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {comments.map((comment, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{comment.customerName || comment.customerUserName}</td>
                                    <td>{comment.content}</td>
                                    <td>{comment.createDate}</td>
                                    <td>{comment.status}</td>
                                    <td>
                                        <div className="project-actions text-right">
                                            <button
                                                className="btn btn-gray btn-sm mr-2"
                                                onClick={() => handleDetailClick(comment)}
                                            >
                                                <i className="fas fa-info-circle"></i>
                                            </button>
                                            <button className="btn btn-warning btn-sm mr-2">
                                                <i className="fas fa-lock"></i>
                                            </button>
                                            <button className="btn btn-danger btn-sm">
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

            <Modal size="lg" show={showModal} onHide={handleClose}>
                <Modal.Header>
                    <Modal.Title>Chi tiết bình luận</Modal.Title>
                    <Button variant="light" className="close" aria-label="Close" onClick={handleClose}>
                        <span>&times;</span>
                    </Button>
                </Modal.Header>
                <Modal.Body>
                    {selectedComment && (
                        <table className="table table-bordered table-striped">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Tên khách hàng</th>
                                    <th>Nội dung</th>
                                    <th>Thời gian</th>
                                    <th>Trạng thái</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {selectedComment.comments.map((comment, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{comment.customerName || comment.customerUserName}</td>
                                        <td>{comment.content}</td>
                                        <td>{comment.createDate}</td>
                                        <td>{comment.status}</td>
                                        <td>
                                            <div className="project-actions text-right">
                                                <button className="btn btn-warning btn-sm mr-2">
                                                    <i className="fas fa-lock"></i>
                                                </button>
                                                <button className="btn btn-danger btn-sm">
                                                    <i className="fas fa-trash-alt"></i>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="light" onClick={handleClose}>
                        <i className="fas fa-times-circle"></i> Đóng
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default Comment;
