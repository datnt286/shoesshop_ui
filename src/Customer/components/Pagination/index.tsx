import React from 'react';
import ReactPaginate from 'react-paginate';

interface PaginationProps {
    totalPages: number;
    onPageChange: ({ selected }: { selected: number }) => void;
}

const Pagination: React.FC<PaginationProps> = ({ totalPages, onPageChange }) => {
    return (
        <ReactPaginate
            pageCount={totalPages}
            onPageChange={onPageChange}
            containerClassName="pagination d-flex justify-content-center mt-5"
            pageClassName="page-item"
            previousClassName="page-item"
            nextClassName="page-item"
            activeClassName="active"
            pageLinkClassName="page-link rounded"
            previousLinkClassName="page-link rounded"
            nextLinkClassName="page-link rounded"
            previousLabel="&laquo;"
            nextLabel="&raquo;"
        />
    );
};

export default Pagination;
