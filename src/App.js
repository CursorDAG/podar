import React, { useState, useEffect } from 'react';
import Table from './components/Table';
import Pagination from './components/Pagination';
import './style.css';

const rowsPerPage = 20;

const buttonStyle = {
    padding: '10px 20px',
    margin: '10px',
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

const App = () => {
    const [data, setData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch('/owners.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                const ownersCount = {};

                data.forEach(owner => {
                    if (ownersCount[owner.name]) {
                        ownersCount[owner.name].count++;
                    } else {
                        ownersCount[owner.name] = { count: 1, link: owner.link };
                    }
                });

                const sortedData = Object.entries(ownersCount).sort((a, b) => b[1].count - a[1].count);
                setData(sortedData);
            })
            .catch(error => {
                console.error('Ошибка загрузки данных:', error);
                setError('Ошибка загрузки данных');
            });
    }, []);

    const displayPage = (page) => {
        setCurrentPage(page);
    };

    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const pageData = data.slice(start, end);
    const pageCount = Math.ceil(data.length / rowsPerPage);

    return (
        <div className="container">
            {error ? <div className="error">{error}</div> : <Table data={pageData} />}
            <Pagination pageCount={pageCount} currentPage={currentPage} onPageChange={displayPage} />
            <button style={buttonStyle} onClick={() => window.location.reload()}>Обновить данные</button>
        </div>
    );
};

export default App;
