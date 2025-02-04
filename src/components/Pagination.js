import React from 'react';

const Pagination = ({ pageCount, currentPage, onPageChange }) => {
    const pages = Array.from({ length: pageCount }, (_, i) => i + 1);

    const buttonStyle = {
        padding: '10px 20px',
        margin: '5px',
        backgroundColor: '#4CAF50',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '16px'
    };

    const buttonDisabledStyle = {
        ...buttonStyle,
        backgroundColor: '#ccc',
        cursor: 'not-allowed'
    };

    const activeButtonStyle = {
        ...buttonStyle,
        backgroundColor: '#2E7D32'
    };

    return (
        <div id="pagination">
            {pages.map(page => (
                <button
                    key={page}
                    style={page === currentPage ? activeButtonStyle : buttonStyle}
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
