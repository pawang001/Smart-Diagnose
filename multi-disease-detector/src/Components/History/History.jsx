import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './History.css';

// Reusable Icon Component
const Icon = ({ path, className = '' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`icon ${className}`}>
        <path fillRule="evenodd" d={path} clipRule="evenodd" />
    </svg>
);

// Confirmation Modal Component
const ConfirmationModal = ({ onConfirm, onCancel }) => (
    <div className="modal-backdrop">
        <div className="modal-card">
            <h3>Are you sure?</h3>
            <p>This action will permanently delete all your prediction records. This cannot be undone.</p>
            <div className="modal-actions">
                <button onClick={onCancel} className="modal-button secondary">Cancel</button>
                <button onClick={onConfirm} className="modal-button danger">Yes, Clear History</button>
            </div>
        </div>
    </div>
);

const History = () => {
    const [history, setHistory] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const storedHistory = JSON.parse(localStorage.getItem('predictionHistory')) || [];
        setHistory(storedHistory);
    }, []);

    const handleClearHistory = () => {
        setIsModalOpen(true); // Open the modal instead of clearing directly
    };

    const confirmClearHistory = () => {
        localStorage.removeItem('predictionHistory');
        setHistory([]);
        setIsModalOpen(false);
    };

    return (
        <>
            {isModalOpen && <ConfirmationModal onConfirm={confirmClearHistory} onCancel={() => setIsModalOpen(false)} />}
            <div className="history-page-container">
                {/* The aurora-bg div has been removed from here */}
                <div className="history-card">
                    <div className="history-card-header">
                        <h2>Prediction History</h2>
                        {history.length > 0 && (
                            <button onClick={handleClearHistory} className="clear-button">
                                <Icon path="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                <span>Clear History</span>
                            </button>
                        )}
                    </div>
                    <div className="history-list">
                        {history.length > 0 ? (
                            history.map((record, index) => (
                                <Link to={`/result/${record.id}`} key={record.id} className="history-item-link" style={{ animationDelay: `${index * 70}ms` }}>
                                    <div className="history-item">
                                        <div className="item-main-info">
                                            <span className={`item-status-dot ${record.result.prediction === 1 ? 'positive' : 'negative'}`}></span>
                                            <div className="item-details">
                                                <span className="item-disease">{record.disease}</span>
                                                <span className="item-date">{new Date(record.date).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true })}</span>
                                            </div>
                                        </div>
                                        <div className="item-result-section">
                                            <span className={`item-result ${record.result.prediction === 1 ? 'positive' : 'negative'}`}>
                                                {record.result.prediction === 1 ? "Positive" : "Negative"}
                                            </span>
                                            <Icon path="M8.25 4.5l7.5 7.5-7.5 7.5" className="item-arrow-icon" />
                                        </div>
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <div className="no-history-container">
                                <Icon path="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" className="no-history-icon" />
                                <h3>No History Found</h3>
                                <p>It looks like you haven't made any predictions yet.</p>
                                <Link to="/predict/breast-cancer" className="action-button">Make a Prediction</Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default History;