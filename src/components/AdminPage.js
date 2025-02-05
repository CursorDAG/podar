import React, { useState, useMemo } from 'react';
import axios from 'axios';
import styles from './AdminPage.module.css';

const AdminPage = () => {
    const [name, setName] = useState('');
    const [link, setLink] = useState('');
    const [message, setMessage] = useState('');
    const [startId, setStartId] = useState('');
    const [endId, setEndId] = useState('');
    const [parserMessage, setParserMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/owners', { name, link });
            setMessage(`Owner ${response.data.name} added successfully!`);
            setName('');
            setLink('');
        } catch (error) {
            setMessage('Error adding owner.');
        }
    };

    const handleParserSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/parse', { startId, endId });
            setParserMessage(`Parsing started for IDs from ${startId} to ${endId}`);
            setStartId('');
            setEndId('');
        } catch (error) {
            setParserMessage('Error starting parser.');
        }
    };

    const memoizedMessage = useMemo(() => message, [message]);
    const memoizedParserMessage = useMemo(() => parserMessage, [parserMessage]);

    return (
        <div className={styles.container}>
            <h1>Admin Page</h1>
            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formGroup}>
                    <label htmlFor="name">Name:</label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="link">Link:</label>
                    <input
                        type="text"
                        id="link"
                        value={link}
                        onChange={(e) => setLink(e.target.value)}
                    />
                </div>
                <button type="submit" className={styles.button}>Add Owner</button>
            </form>
            {memoizedMessage && <p className={styles.message}>{memoizedMessage}</p>}

            <h2>Start Parser</h2>
            <form onSubmit={handleParserSubmit} className={styles.form}>
                <div className={styles.formGroup}>
                    <label htmlFor="startId">Start ID:</label>
                    <input
                        type="number"
                        id="startId"
                        value={startId}
                        onChange={(e) => setStartId(e.target.value)}
                        required
                    />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="endId">End ID:</label>
                    <input
                        type="number"
                        id="endId"
                        value={endId}
                        onChange={(e) => setEndId(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className={styles.button}>Start Parsing</button>
            </form>
            {memoizedParserMessage && <p className={styles.message}>{memoizedParserMessage}</p>}
        </div>
    );
};

export default AdminPage;
