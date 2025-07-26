    import React from 'react';
    import './Result.css';

    // --- Component to show detailed info based on the result ---
    const DiseaseInfo = ({ isMalignant }) => {
      const title = isMalignant ? "Malignant" : "Benign";
      const description = isMalignant
        ? "The prediction indicates the presence of cancerous cells. It is crucial to consult with a healthcare professional for further diagnosis and treatment options."
        : "The prediction indicates the absence of cancerous cells. This is a positive sign, but regular check-ups are still recommended.";
      const image_url = isMalignant 
        ? "https://placehold.co/400x200/ef4444/white?text=Malignant" 
        : "https://placehold.co/400x200/22c55e/white?text=Benign";

      return (
        <div className="disease-info">
          <img src={image_url} alt={title} className="result-image" />
          <div className="info-text">
            <h3>{title}</h3>
            <p>{description}</p>
          </div>
        </div>
      );
    };

    // --- Main Result Display Component ---
    const Result = ({ result, error, isLoading }) => {
      const renderContent = () => {
        if (isLoading) {
          return <div className="loader"></div>;
        }

        if (error) {
          return <p className="api-error-message">{error}</p>;
        }

        if (result) {
          // The backend sends `prediction: 1` for Malignant, `0` for Benign
          const isMalignant = result.prediction === 1;
          return <DiseaseInfo isMalignant={isMalignant} />;
        }

        // Default state before any prediction is made
        return <p className="default-message">Your diagnosis will appear here.</p>;
      };

      return (
        <div className="current-result-card card">
          <div className="card-header">
            {/* You can add an icon here if you like */}
            <h2>Prediction Result</h2>
          </div>
          <div className="result-content-wrapper">
            {renderContent()}
          </div>
        </div>
      );
    };

    export default Result;
    