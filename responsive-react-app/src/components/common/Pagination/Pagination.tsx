import React from 'react';
import './Pagination.css';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <nav className="pagination">
      <ul className="pagination-list">
        <li className={`pagination-item ${currentPage === 1 ? 'disabled' : ''}`}>
          <a onClick={() => onPageChange(currentPage - 1)}>&laquo;</a>
        </li>
        {pageNumbers.map(number => (
          <li key={number} className={`pagination-item ${currentPage === number ? 'active' : ''}`}>
            <a onClick={() => onPageChange(number)}>{number}</a>
          </li>
        ))}
        <li className={`pagination-item ${currentPage === totalPages ? 'disabled' : ''}`}>
          <a onClick={() => onPageChange(currentPage + 1)}>&raquo;</a>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;
