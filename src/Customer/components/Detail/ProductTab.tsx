import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import AxiosInstance from '../../../services/AxiosInstance';
import config from '../../../services/config';
import Pagination from '../Pagination';
import DefaultAvatar from '../../resources/img/default-avatar.jpg';

interface Model {
    id: number;
    name: string;
    productTypeId: number;
    price: number;
    description: string;
    images: Image[];
    isBought: boolean;
}

interface Image {
    id: number;
    name: string;
}

interface User {
    id: string;
    userName: string;
    name?: string;
    avatar?: string;
}

interface Review {
    id: number;
    userId: string;
    customerUserName: string;
    customerName: string;
    customerAvatar: string;
    modelId: number;
    rating: number;
    content: string;
    createDate: string;
    status: string;
}

interface Comment {
    id: number;
    userId: string;
    customerUserName: string;
    customerName: string;
    customerAvatar: string;
    modelId: number;
    parentCommentId: number | null;
    content: string;
    createDate: string;
    status: string;
    comments: Comment[];
}

interface ProductTabProps {
    token: string | null;
    model: Model | null;
    user: User;
}

const ProductTab: React.FC<ProductTabProps> = ({ token, user, model }) => {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [rating, setRating] = useState<number>(5);
    const [reviewContent, setReviewContent] = useState('');
    const [totalReviewPages, setTotalReviewPages] = useState(1);
    const [isEditing, setIsEditing] = useState<boolean>(false);

    const [comments, setComments] = useState<Comment[]>([]);
    const [commentContent, setCommentContent] = useState('');
    const [replyContent, setReplyContent] = useState('');
    const [replyToCommentId, setReplyToCommentId] = useState<number | null>(null);
    const [parentCommentId, setParentCommentId] = useState<number | null>(null);
    const [isReplying, setIsReplying] = useState(false);
    const [totalCommentPages, setTotalCommentPages] = useState(1);
    const [commentValidationError, setCommentValidationError] = useState('');
    const [replyValidationError, setReplyValidationError] = useState('');

    const userAvatar = user.avatar ? `${config.baseURL}/images/avatar/${user.avatar}` : DefaultAvatar;

    const fetchReviews = async (currentPage = 1, pageSize = 5) => {
        if (model) {
            try {
                const response = await AxiosInstance.get(`/Reviews/Model/${model.id}`, {
                    params: {
                        currentPage,
                        pageSize,
                    },
                });

                if (response.status === 200) {
                    setReviews(response.data.items);
                    setTotalReviewPages(response.data.totalPages);
                }
            } catch (error) {
                console.error('Lỗi: ', error);
            }
        }
    };

    useEffect(() => {
        fetchReviews();
    }, [model]);

    useEffect(() => {
        const userReview = reviews.find((review) => review.userId === user.id);
        if (userReview) {
            setIsEditing(true);
            setRating(userReview.rating);
            setReviewContent(userReview.content);
        } else {
            setIsEditing(false);
            setRating(5);
            setReviewContent('Nội dung *');
        }
    }, [user.id, reviews]);

    const handleReviewPageChange = ({ selected }: { selected: number }) => {
        const currentPage = selected + 1;
        fetchReviews(currentPage);
    };

    const handlePostReview = async () => {
        try {
            const data = {
                userId: user.id,
                modelId: model?.id,
                rating: rating,
                content: reviewContent,
            };

            const response = await AxiosInstance.post('/Reviews', data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.status === 201) {
                fetchReviews();
                setIsEditing(false);
                setRating(5);
                setReviewContent('Nội dung *');
            }
        } catch (error) {
            console.error('Lỗi: ', error);
        }
    };

    const fetchComments = async (currentPage = 1, pageSize = 5) => {
        if (model) {
            try {
                const response = await AxiosInstance.get(`/Comments/ByModel/${model.id}`, {
                    params: {
                        currentPage,
                        pageSize,
                    },
                });

                if (response.status === 200) {
                    setComments(response.data.items);
                    setTotalCommentPages(response.data.totalPages);
                }
            } catch (error) {
                console.error('Lỗi: ', error);
            }
        }
    };

    useEffect(() => {
        fetchComments();
    }, [model]);

    const handleCommentPageChange = ({ selected }: { selected: number }) => {
        const currentPage = selected + 1;
        fetchComments(currentPage);
    };

    const handlePostComment = async () => {
        if (!commentContent) {
            setCommentValidationError('Vui lòng nhập nội dung bình luận.');
            return;
        }

        try {
            const data = {
                userId: user.id,
                modelId: model?.id,
                parentCommentId: null,
                content: commentContent,
            };

            const response = await AxiosInstance.post('/Comments', data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.status === 201) {
                fetchComments();
                setCommentContent('');
                setCommentValidationError('');
            }
        } catch (error) {
            console.error('Lỗi: ', error);
        }
    };

    const handlePostReply = async () => {
        if (!replyContent) {
            setReplyValidationError('Vui lòng nhập nội dung trả lời.');
            return;
        }

        try {
            const data = {
                userId: user.id,
                modelId: model?.id,
                parentCommentId: parentCommentId,
                content: replyContent,
            };

            const response = await AxiosInstance.post('/Comments', data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.status === 201) {
                fetchComments();
                setReplyContent('');
                setReplyToCommentId(null);
                setParentCommentId(null);
                setIsReplying(false);
                setReplyValidationError('');
            }
        } catch (error) {
            console.error('Lỗi: ', error);
        }
    };

    const handleReply = (comment: Comment) => {
        setReplyContent('');
        setReplyToCommentId(comment.id);
        setParentCommentId(comment.parentCommentId !== null ? comment.parentCommentId : comment.id);
        setIsReplying(!isReplying);
        setReplyValidationError('');
    };

    const handleCancelReply = () => {
        setReplyContent('');
        setReplyToCommentId(null);
        setParentCommentId(null);
        setIsReplying(false);
        setReplyValidationError('');
    };

    const handleDeleteCommment = async (id: number) => {
        const confirmed = await Swal.fire({
            title: 'Xác nhận xoá bình luận.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Xác nhận',
            confirmButtonColor: '#3085d6',
            cancelButtonText: 'Huỷ',
        });

        if (confirmed.isConfirmed) {
            try {
                const response = await AxiosInstance.put(`/Comments/SoftDelete/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.status === 204) {
                    fetchComments();
                }
            } catch (error) {
                console.error('Lỗi khi xoá bình luận: ', error);
            }
        }
    };

    return (
        <div className="col-lg-12">
            <nav>
                <div className="nav nav-tabs mb-3">
                    <button
                        id="nav-description-tab"
                        role="tab"
                        className="nav-link active border-white border-bottom-0"
                        data-bs-toggle="tab"
                        data-bs-target="#nav-description"
                        aria-controls="nav-description"
                        aria-selected="true"
                    >
                        Mô tả
                    </button>
                    <button
                        id="nav-review-tab"
                        className="nav-link border-white border-bottom-0"
                        role="tab"
                        data-bs-toggle="tab"
                        data-bs-target="#nav-review"
                        aria-controls="nav-review"
                        aria-selected="false"
                    >
                        Đánh giá
                    </button>
                    <button
                        id="nav-comment-tab"
                        className="nav-link border-white border-bottom-0"
                        role="tab"
                        data-bs-toggle="tab"
                        data-bs-target="#nav-comment"
                        aria-controls="nav-comment"
                        aria-selected="false"
                    >
                        Bình luận
                    </button>
                </div>
            </nav>
            <div className="tab-content mb-5">
                <div
                    id="nav-description"
                    className="tab-pane active"
                    role="tabpanel"
                    aria-labelledby="nav-description-tab"
                >
                    {model?.description ? <p>{model.description}</p> : <p>Mô tả sản phẩm.</p>}
                </div>
                <div id="nav-review" className="tab-pane" role="tabpanel" aria-labelledby="nav-review-tab">
                    {reviews.length > 0 ? (
                        <>
                            {reviews.map((review) => {
                                const customerAvatar = review.customerAvatar
                                    ? `${config.baseURL}/images/avatar/${review.customerAvatar}`
                                    : DefaultAvatar;

                                return (
                                    <div className="d-flex">
                                        <img
                                            src={customerAvatar}
                                            className="img-fluid rounded-circle p-3"
                                            style={{ width: '100px', height: '100px' }}
                                            alt="Ảnh đại diện"
                                        />
                                        <div className="w-100">
                                            <p className="mb-2" style={{ fontSize: '14px' }}>
                                                {review.createDate}
                                            </p>
                                            <div className="d-flex justify-content-between">
                                                <h5>{review.customerName || review.customerUserName}</h5>
                                                <div className="d-flex mb-3">
                                                    {[...Array(5)].map((_, index) => (
                                                        <i
                                                            key={index}
                                                            className={`fa fa-star ${
                                                                index < review.rating ? 'text-secondary' : ''
                                                            }`}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                            <p className="text-break">{review.content}</p>
                                        </div>
                                    </div>
                                );
                            })}
                            <Pagination totalPages={totalReviewPages} onPageChange={handleReviewPageChange} />
                        </>
                    ) : (
                        <p className="text-center pt-3">Sản phẩm chưa có đánh giá nào.</p>
                    )}
                    {token ? (
                        <>
                            {model?.isBought ? (
                                <div>
                                    <h4 className="my-5 fw-bold">
                                        {isEditing ? 'Chỉnh sửa đánh giá của bạn' : 'Viết đánh giá của bạn'}
                                    </h4>
                                    <div className="row g-4">
                                        <div className="col-lg-12">
                                            <div className="border-bottom rounded my-4">
                                                <textarea
                                                    className="form-control border-0"
                                                    cols={30}
                                                    rows={8}
                                                    value={reviewContent}
                                                    onChange={(e) => setReviewContent(e.target.value)}
                                                    placeholder="Nội dung *"
                                                ></textarea>
                                            </div>
                                        </div>
                                        <div className="col-lg-12">
                                            <div className="d-flex justify-content-between py-3 mb-5">
                                                <div className="d-flex align-items-center">
                                                    <p className="mb-0 me-3">Đánh giá:</p>
                                                    <div className="d-flex align-items-center">
                                                        {[...Array(5)].map((_, index) => (
                                                            <i
                                                                key={index}
                                                                className={`fa fa-star ${
                                                                    index < rating ? 'text-secondary' : ''
                                                                }`}
                                                                onClick={() => setRating(index + 1)}
                                                            />
                                                        ))}
                                                    </div>
                                                </div>
                                                <button
                                                    className="btn border border-secondary text-primary rounded-pill px-4 py-2"
                                                    onClick={handlePostReview}
                                                >
                                                    {isEditing ? 'Cập nhật' : 'Đăng'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-center pt-3">Những khách hàng đã mua hàng mới được đánh giá.</p>
                            )}
                        </>
                    ) : (
                        <p className="text-center pt-3">
                            Đăng nhập để đánh giá. <Link to="/dang-nhap">Đăng nhập</Link>
                        </p>
                    )}
                </div>
                <div id="nav-comment" className="tab-pane" role="tabpanel" aria-labelledby="nav-comment-tab">
                    <>
                        {comments.length > 0 ? (
                            <>
                                {comments.map((comment) => {
                                    const customerAvatar = comment.customerAvatar
                                        ? `${config.baseURL}/images/avatar/${comment.customerAvatar}`
                                        : DefaultAvatar;

                                    return (
                                        <React.Fragment key={comment.id}>
                                            <div className="d-flex">
                                                <img
                                                    src={customerAvatar}
                                                    className="img-fluid rounded-circle p-3"
                                                    style={{ width: '100px', height: '100px' }}
                                                    alt="Ảnh đại diện"
                                                />
                                                <div className="mb-3">
                                                    <p className="mb-2" style={{ fontSize: '14px' }}>
                                                        {comment.createDate}
                                                    </p>
                                                    <h5>{comment.customerName || comment.customerUserName}</h5>
                                                    <p className="mb-2">{comment.content}</p>
                                                    {token && (
                                                        <span
                                                            className="btn-comment mx-2"
                                                            style={{ cursor: 'pointer' }}
                                                            onClick={() => handleReply(comment)}
                                                        >
                                                            Trả lời
                                                        </span>
                                                    )}
                                                    {user.id === comment.userId && (
                                                        <span
                                                            className="btn-comment mx-1"
                                                            style={{ cursor: 'pointer' }}
                                                            onClick={() => handleDeleteCommment(comment.id)}
                                                        >
                                                            Xoá
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            {replyToCommentId === comment.id && isReplying && (
                                                <div className="mt-3">
                                                    <div className="d-flex">
                                                        <img
                                                            src={userAvatar}
                                                            className="img-fluid rounded-circle p-3"
                                                            style={{
                                                                width: '100px',
                                                                height: '100px',
                                                            }}
                                                            alt="Ảnh đại diện"
                                                        />
                                                        <textarea
                                                            className="form-control border-1"
                                                            cols={30}
                                                            rows={4}
                                                            value={replyContent}
                                                            onChange={(e) => setReplyContent(e.target.value)}
                                                            placeholder={
                                                                replyValidationError
                                                                    ? replyValidationError
                                                                    : 'Nhập nội dung trả lời'
                                                            }
                                                        ></textarea>
                                                    </div>
                                                    <div className="text-end mt-3">
                                                        <button
                                                            className="btn border text-primary rounded-pill px-4 py-2 mx-3"
                                                            onClick={handleCancelReply}
                                                        >
                                                            Huỷ
                                                        </button>
                                                        <button
                                                            className="btn border border-secondary text-primary rounded-pill px-4 py-2"
                                                            onClick={handlePostReply}
                                                        >
                                                            Đăng
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                            {comment.comments.map((reply) => {
                                                const customerAvatar = reply.customerAvatar
                                                    ? `${config.baseURL}/images/avatar/${reply.customerAvatar}`
                                                    : DefaultAvatar;

                                                return (
                                                    <React.Fragment key={reply.id}>
                                                        <div className="d-flex" style={{ marginLeft: '34px' }}>
                                                            <img
                                                                src={customerAvatar}
                                                                className="img-fluid rounded-circle p-3"
                                                                style={{
                                                                    width: '100px',
                                                                    height: '100px',
                                                                }}
                                                                alt="Ảnh đại diện"
                                                            />
                                                            <div className="mb-3">
                                                                <p className="mb-2" style={{ fontSize: '14px' }}>
                                                                    {reply.createDate}
                                                                </p>
                                                                <h5>{reply.customerName || reply.customerUserName}</h5>
                                                                <p className="mb-2">{reply.content}</p>
                                                                {token && (
                                                                    <span
                                                                        className="btn-comment mx-2"
                                                                        style={{ cursor: 'pointer' }}
                                                                        onClick={() => handleReply(reply)}
                                                                    >
                                                                        Trả lời
                                                                    </span>
                                                                )}
                                                                {user.id === reply.userId && (
                                                                    <span
                                                                        className="btn-comment mx-1"
                                                                        style={{ cursor: 'pointer' }}
                                                                        onClick={() => handleDeleteCommment(reply.id)}
                                                                    >
                                                                        Xoá
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                        {replyToCommentId === reply.id && isReplying && (
                                                            <div className="mt-3" style={{ marginLeft: '34px' }}>
                                                                <div className="d-flex">
                                                                    <img
                                                                        src={userAvatar}
                                                                        className="img-fluid rounded-circle p-3"
                                                                        style={{
                                                                            width: '100px',
                                                                            height: '100px',
                                                                        }}
                                                                        alt="Ảnh đại diện"
                                                                    />
                                                                    <textarea
                                                                        className="form-control border-1"
                                                                        cols={30}
                                                                        rows={4}
                                                                        value={replyContent}
                                                                        onChange={(e) =>
                                                                            setReplyContent(e.target.value)
                                                                        }
                                                                        placeholder={
                                                                            replyValidationError
                                                                                ? replyValidationError
                                                                                : 'Nhập nội dung trả lời'
                                                                        }
                                                                    ></textarea>
                                                                </div>
                                                                <div className="text-end mt-3">
                                                                    <button
                                                                        className="btn border text-primary rounded-pill px-4 py-2 mx-3"
                                                                        onClick={handleCancelReply}
                                                                    >
                                                                        Huỷ
                                                                    </button>
                                                                    <button
                                                                        className="btn border border-secondary text-primary rounded-pill px-4 py-2"
                                                                        onClick={handlePostReply}
                                                                    >
                                                                        Đăng
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </React.Fragment>
                                                );
                                            })}
                                        </React.Fragment>
                                    );
                                })}
                                <Pagination totalPages={totalCommentPages} onPageChange={handleCommentPageChange} />
                            </>
                        ) : (
                            <p className="text-center pt-3">Sản phẩm chưa có bình luận nào.</p>
                        )}
                    </>
                    <>
                        {token ? (
                            <>
                                <h4 className="my-5 fw-bold">Viết bình luận của bạn</h4>
                                <div className="row g-4">
                                    <div className="col-lg-12">
                                        <div className="d-flex my-4">
                                            <img
                                                src={userAvatar}
                                                className="img-fluid rounded-circle p-3"
                                                style={{ width: '100px', height: '100px' }}
                                                alt="Ảnh đại diện"
                                            />
                                            <textarea
                                                className="form-control border-1"
                                                cols={30}
                                                rows={8}
                                                value={commentContent}
                                                onChange={(e) => setCommentContent(e.target.value)}
                                                placeholder={
                                                    commentValidationError ? commentValidationError : 'Nội dung *'
                                                }
                                            ></textarea>
                                        </div>
                                    </div>
                                    <div className="col-lg-12">
                                        <div className="d-flex justify-content-end py-3 mb-5">
                                            <button
                                                className="btn border border-secondary text-primary rounded-pill px-4 py-2"
                                                onClick={handlePostComment}
                                            >
                                                Đăng
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <p className="text-center pt-3">
                                Đăng nhập để bình luận. <Link to="/dang-nhap">Đăng nhập</Link>
                            </p>
                        )}
                    </>
                </div>
                <div className="tab-pane" id="nav-vision" role="tabpanel">
                    <p className="text-dark">
                        Tempor erat elitr rebum at clita. Diam dolor diam ipsum et tempor sit. Aliqu diam amet diam et
                        eos labore. 3
                    </p>
                    <p className="mb-0">
                        Diam dolor diam ipsum et tempor sit. Aliqu diam amet diam et eos labore. Clita erat ipsum et
                        lorem et sit
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ProductTab;
