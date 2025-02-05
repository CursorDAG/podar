import React, { useState, useMemo } from 'react';
import styles from './Table.module.css';

const Table = React.memo(({ data }) => {
    const [sortConfig, setSortConfig] = useState({ key: 'count', direction: 'descending' });

    const sortedData = useMemo(() => {
        return [...data].sort((a, b) => {
            if (a[1][sortConfig.key] < b[1][sortConfig.key]) {
                return sortConfig.direction === 'ascending' ? -1 : 1;
            }
            if (a[1][sortConfig.key] > b[1][sortConfig.key]) {
                return sortConfig.direction === 'ascending' ? 1 : -1;
            }
            return 0;
        });
    }, [data, sortConfig]);

    const requestSort = key => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const totalSum = useMemo(() => {
        return data.reduce((sum, [, info]) => sum + info.count, 0);
    }, [data]);

    return (
        <div className={styles.container}>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th className={styles.th} onClick={() => requestSort('name')}>Owner</th>
                        <th className={styles.th} onClick={() => requestSort('count')}>Count</th>
                    </tr>
                </thead>
                <tbody>
                    {sortedData.map(([name, info]) => (
                        <tr key={name} className={styles.tr}>
                            <td className={styles.ownerTd}>
                                <a href={info.link} target="_blank" rel="noopener noreferrer">
                                    {name}
                                </a>
                            </td>
                            <td className={styles.td}>{info.count}</td>
                        </tr>
                    ))}
                    <tr>
                        <td className={styles.ownerTd}><strong>Total</strong></td>
                        <td className={styles.td}><strong>{totalSum}</strong></td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
});

export default Table;
