import React, { useState } from 'react';

const Table = ({ data }) => {
    const [sortConfig, setSortConfig] = useState({ key: 'count', direction: 'descending' });

    const sortedData = [...data].sort((a, b) => {
        if (a[1][sortConfig.key] < b[1][sortConfig.key]) {
            return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[1][sortConfig.key] > b[1][sortConfig.key]) {
            return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
    });

    const requestSort = key => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const tableStyle = {
        width: '100%',
        borderCollapse: 'collapse'
    };

    const thStyle = {
        cursor: 'pointer',
        border: '1px solid #ddd'
    };

    const tdStyle = {
        padding: '10px',
        border: '1px solid #ddd'
    };

    const ownerTdStyle = {
        ...tdStyle,
        minWidth: '250px' // Увеличение минимальной ширины ячеек для owner
    };

    const containerStyle = {
        width: '80%',
        maxWidth: '600px',
        margin: '0 auto',
        textAlign: 'center' // Выравнивание по центру для всех объектов страницы
    };

    return (
        <div style={containerStyle}>
            <table style={tableStyle}>
                <thead>
                    <tr>
                        <th style={thStyle} onClick={() => requestSort('name')}>Owner</th>
                        <th style={thStyle} onClick={() => requestSort('count')}>Count</th>
                    </tr>
                </thead>
                <tbody>
                    {sortedData.map(([name, info]) => (
                        <tr key={name}>
                            <td style={ownerTdStyle}>
                                <a href={info.link} target="_blank" rel="noopener noreferrer">
                                    {name}
                                </a>
                            </td>
                            <td style={tdStyle}>{info.count}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Table;
