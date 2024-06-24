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
            containerClassName="pagination employee m-0 float-right"
            pageClassName="page-item"
            previousClassName="page-item"
            nextClassName="page-item"
            activeClassName="active"
            pageLinkClassName="page-link"
            previousLinkClassName="page-link"
            nextLinkClassName="page-link"
            previousLabel="&laquo;"
            nextLabel="&raquo;"
        />
    );
};

export default Pagination;
