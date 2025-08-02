import React from 'react';
import './PredictionForm.css'; // It shares styles with the prediction form

const PastRecordItem = ({ record }) => {
  const isPositive = record.result === 'Positive';
  return (
    <div className="past-record-item">
      <span className={`record-status-dot ${isPositive ? 'positive' : 'negative'}`}></span>
      <div className="record-details">
        <span className="record-disease-name">{record.diseaseName}</span>
        <span className="record-result">{record.result}</span>
      </div>
      <span className="record-date">{record.date}</span>
    </div>
  );
};

export default PastRecordItem;
