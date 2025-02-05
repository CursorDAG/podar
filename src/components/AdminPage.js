import React, { useState, useMemo } from 'react';
import axios from 'axios';
import styles from './AdminPage.module.css';

const AdminPage = () => {
    const [name, setName] = useState('');
    const [link, setLink] = useState('');
    const [message, setMessage] = useState('');

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

    const memoizedMessage = useMemo(() => message, [message]);

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
        </div>
    );
};

export default AdminPage;
