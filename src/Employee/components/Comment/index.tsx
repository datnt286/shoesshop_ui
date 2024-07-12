import React, { useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Swal from 'sweetalert2';
import AxiosInstance from './../../../services/AxiosInstance';
import Pagination from './../Pagination/index';

interface Comment {
    id: number;
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
                timerProgressBar: true,
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

    const handleToggleStatus = async (id: number, currentStatus: number) => {
        try {
            const newStatus = currentStatus === 1 ? 0 : 1;
            const response = await AxiosInstance.put(`/Comments/UpdateStatus/${id}`);

            if (response.status === 204) {
                if (selectedComment) {
                    const updatedComments = selectedComment.comments.map((comment) => {
                        if (comment.id === id) {
                            return { ...comment, status: newStatus };
                        }
                        return comment;
                    });
                    setSelectedComment({ ...selectedComment, comments: updatedComments });
                }

                const updatedMainComments = comments.map((comment) => {
                    if (comment.id === id) {
                        return { ...comment, status: newStatus };
                    }
                    return comment;
                });

                setComments(updatedMainComments);

                Swal.fire({
                    title: 'Cập nhật trạng thái bình luận thành công.',
                    icon: 'success',
                    toast: true,
                    position: 'top-end',
                    timerProgressBar: true,
                    showConfirmButton: false,
                    timer: 1000,
                });
            }
        } catch (error) {
            console.error('Lỗi khi cập nhật trạng thái bình luận: ', error);

            Swal.fire({
                title: 'Lỗi khi cập nhật trạng thái bình luận.',
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
                            {comments.length > 0 ? (
                                comments.map((comment, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{comment.customerName || comment.customerUserName}</td>
                                        <td>{comment.content}</td>
                                        <td>{comment.createDate}</td>
                                        <td>{comment.status === 1 ? 'Đã hiện' : 'Đã ẩn'}</td>
                                        <td>
                                            <div className="project-actions text-right">
                                                <button
                                                    className="btn btn-gray btn-sm mr-2"
                                                    onClick={() => handleDetailClick(comment)}
                                                >
                                                    <i className="fas fa-info-circle"></i> Xem phản hồi
                                                </button>
                                                <button
                                                    className={`btn ${
                                                        comment.status === 1 ? 'btn-warning' : 'btn-success'
                                                    } btn-sm mr-2`}
                                                    onClick={() => handleToggleStatus(comment.id, comment.status)}
                                                >
                                                    <i
                                                        className={
                                                            comment.status === 1 ? 'fas fa-eye-slash' : 'fas fa-eye'
                                                        }
                                                    ></i>{' '}
                                                    {comment.status === 1 ? 'Ẩn' : 'Hiện'}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <h3 className="m-2">Danh sách bình luận trống.</h3>
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="card-footer clearfix">
                    <Pagination totalPages={totalPages} onPageChange={handlePageChange} />
                </div>
            </div>

            <Modal size="lg" show={showModal} onHide={handleClose}>
                <Modal.Header>
                    <Modal.Title>Danh sách phản hồi</Modal.Title>
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
                                {selectedComment.comments.length > 0 ? (
                                    selectedComment.comments.map((comment, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{comment.customerName || comment.customerUserName}</td>
                                            <td>{comment.content}</td>
                                            <td>{comment.createDate}</td>
                                            <td>{comment.status === 1 ? 'Đã hiện' : 'Đã ẩn'}</td>
                                            <td>
                                                <div className="project-actions text-right">
                                                    <button
                                                        className={`btn ${
                                                            comment.status === 1 ? 'btn-warning' : 'btn-success'
                                                        } btn-sm mr-2`}
                                                        onClick={() => handleToggleStatus(comment.id, comment.status)}
                                                    >
                                                        <i
                                                            className={
                                                                comment.status === 1 ? 'fas fa-eye-slash' : 'fas fa-eye'
                                                            }
                                                        ></i>{' '}
                                                        {comment.status === 1 ? 'Ẩn' : 'Hiện'}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <h3 className="m-2">Danh sách phản hồi trống.</h3>
                                )}
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
