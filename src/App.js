import React, { useState, useEffect, useCallback, useRef, Suspense } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import styles from './App.module.css';

const Table = React.lazy(() => import('./components/Table'));
const AdminPage = React.lazy(() => import('./components/AdminPage'));

const rowsPerPage = 20;

const App = () => {
    const [data, setData] = useState([]);
    const [displayData, setDisplayData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [error, setError] = useState(null);
    const observer = useRef();

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
                setDisplayData(sortedData.slice(0, rowsPerPage));
            })
            .catch(error => {
                console.error('Ошибка загрузки данных:', error);
                setError('Ошибка загрузки данных');
            });
    }, []);

    const loadMoreData = useCallback(() => {
        const nextPage = currentPage + 1;
        const start = (nextPage - 1) * rowsPerPage;
        const end = start + rowsPerPage;
        if (start < data.length) {
            setDisplayData(prevData => [...prevData, ...data.slice(start, end)]);
            setCurrentPage(nextPage);
        }
    }, [currentPage, data]);

    useEffect(() => {
        const handleObserver = (entries) => {
            const target = entries[0];
            if (target.isIntersecting) {
                loadMoreData();
            }
        };

        observer.current = new IntersectionObserver(handleObserver);
        const loadMoreElement = document.querySelector('#load-more');
        if (loadMoreElement) {
            observer.current.observe(loadMoreElement);
        }

        return () => {
            const loadMoreElement = document.querySelector('#load-more');
            if (observer.current && loadMoreElement) {
                observer.current.unobserve(loadMoreElement);
            }
        };
    }, [loadMoreData]);

    return (
        <Router>
            <div className={styles.container}>
                <Suspense fallback={<div>Loading...</div>}>
                    <Switch>
                        <Route exact path="/">
                            {error ? <div className={styles.error}>{error}</div> : <Table data={displayData} />}
                            <div id="load-more" className={styles.loadMore}></div>
                            <button className={styles.button} onClick={() => window.location.reload()}>Обновить данные</button>
                        </Route>
                        <Route path="/admin">
                            <AdminPage />
                        </Route>
                    </Switch>
                </Suspense>
            </div>
        </Router>
    );
};

export default App;
