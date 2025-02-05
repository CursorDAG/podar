import React from 'react';
import styles from './Pagination.module.css';

const Pagination = ({ pageCount, currentPage, onPageChange }) => {
    const pages = Array.from({ length: pageCount }, (_, i) => i + 1);

    return (
        <div className={styles.pagination}>
            {pages.map(page => (
                <button
                    key={page}
                    className={`${styles.button} ${page === currentPage ? styles.activeButton : ''}`}
                    onClick={() => onPageChange(page)}
                    disabled={page === currentPage}
                >
                    {page}
                </button>
            ))}
        </div>
    );
};

export default Pagination;
