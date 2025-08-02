import React from 'react';
import './Result.css';

// --- Skeleton Loader Component ---
const SkeletonLoader = () => (
  <div className="skeleton-wrapper">
    <div className="skeleton-image"></div>
    <div className="skeleton-text-group">
      <div className="skeleton-title"></div>
      <div className="skeleton-line"></div>
      <div className="skeleton-line short"></div>
    </div>
  </div>
);

// --- Component to show detailed info based on the result ---
const DiseaseInfo = ({ isPositive, diseaseName }) => {
  const title = isPositive ? "Positive Result" : "Negative Result";
  const description = isPositive
    ? `The prediction for ${diseaseName} indicates a positive result. It is crucial to consult with a healthcare professional for further diagnosis and treatment options.`
    : `The prediction for ${diseaseName} indicates a negative result. This is a good sign, but regular check-ups are still recommended.`;
  const image_url = isPositive 
    ? "https://placehold.co/400x200/ef4444/white?text=Positive" 
    : "https://placehold.co/400x200/22c55e/white?text=Negative";

  return (
    <div className="disease-info animate-in">
      <img src={image_url} alt={title} className="result-image" />
      <div className="info-text">
        <h3 className={isPositive ? 'positive' : 'negative'}>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
};

// --- Main Result Display Component ---
const Result = ({ result, error, isLoading, diseaseName }) => {
  const renderContent = () => {
    if (isLoading) {
      return <SkeletonLoader />;
    }
    if (error) {
      return <p className="api-error-message">{error}</p>;
    }
    if (result) {
      // The backend sends `prediction: 1` for Positive, `0` for Negative
      const isPositive = result.prediction === 1;
      return <DiseaseInfo isPositive={isPositive} diseaseName={diseaseName} />;
    }
    return <p className="default-message">Your diagnosis will appear here.</p>;
  };

  return (
    <div className="current-result-card card">
      <div className="card-header">
        <h2>Prediction Result</h2>
      </div>
      <div className="result-content-wrapper">
        {renderContent()}
      </div>
    </div>
  );
};

export default Result;
