import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import './Result.css';

// --- Configuration for result details ---
// This object provides detailed information based on the prediction.
// It can be easily expanded for other diseases.
const resultDetails = {
    "Breast Cancer": {
        positive: {
            title: "Malignant",
            explanation: "A malignant result suggests the presence of cancerous cells. This is a significant finding that requires immediate follow-up.",
            nextSteps: [
                "Schedule an urgent appointment with an oncologist or breast cancer specialist.",
                "Your doctor will likely order further diagnostic tests like a biopsy, MRI, or PET scan.",
                "Discuss potential treatment options with your healthcare provider."
            ]
        },
        negative: {
            title: "Benign",
            explanation: "A benign result suggests that the tissue is not cancerous. This is a positive outcome.",
            nextSteps: [
                "Continue with regular self-examinations and scheduled mammograms as recommended by your doctor.",
                "Maintain a healthy lifestyle to minimize future risks.",
                "Discuss any concerns or changes you notice with your healthcare provider."
            ]
        }
    }
    // You can add other diseases here, e.g., "Heart Disease": { ... }
};


const Result = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [record, setRecord] = useState(null);

    useEffect(() => {
        const history = JSON.parse(localStorage.getItem('predictionHistory')) || [];
        const currentRecord = history.find(rec => rec.id === id);

        if (currentRecord) {
            setRecord(currentRecord);
        } else {
            console.error("No record found for this ID");
            navigate('/predict'); // Redirect to prediction form if no record
        }
    }, [id, navigate]);

    if (!record) {
        return <div className="result-page-container"><h2>Loading result...</h2></div>;
    }

    const isPositive = record.result.prediction === 1;
    const confidence = record.result.probability ? (record.result.probability * 100).toFixed(1) : null;
    const details = resultDetails[record.disease] ? (isPositive ? resultDetails[record.disease].positive : resultDetails[record.disease].negative) : null;

    return (
        <div className="result-page-container">
            <div className="result-layout">
                {/* --- Left Column: Main Result --- */}
                <div className="result-summary-column">
                    <div className="result-summary-card animate-in">
                        <h2 className={`result-title ${isPositive ? 'positive' : 'negative'}`}>
                            {details ? details.title : (isPositive ? "Positive" : "Negative")}
                        </h2>
                        <p className="result-disease-name">Prediction for {record.disease}</p>
                        
                        {confidence && (
                            <div className="confidence-meter">
                                <p className="confidence-label">Model Confidence: <strong>{confidence}%</strong></p>
                                <div className="confidence-bar-background">
                                    <div className="confidence-bar-foreground" style={{ width: `${confidence}%` }}></div>
                                </div>
                            </div>
                        )}

                        <p className="result-disclaimer">
                            This is a machine learning prediction, not a medical diagnosis. Always consult a healthcare professional for medical advice.
                        </p>
                        <div className="result-actions">
                            <button onClick={() => navigate('/predict')} className="action-button">New Prediction</button>
                            <Link to="/history" className="action-button secondary">View History</Link>
                        </div>
                    </div>
                </div>

                {/* --- Right Column: Details --- */}
                <div className="result-details-column">
                    {details && (
                        <div className="details-card animate-in" style={{animationDelay: '0.1s'}}>
                            <div className="details-card-header"><h3>About the Result</h3></div>
                            <p className="details-explanation">{details.explanation}</p>
                            <h4>Recommended Next Steps:</h4>
                            <ul className="next-steps-list">
                                {details.nextSteps.map((step, index) => <li key={index}>{step}</li>)}
                            </ul>
                        </div>
                    )}
                    <div className="details-card animate-in" style={{animationDelay: '0.2s'}}>
                        <div className="details-card-header"><h3>Data Submitted</h3></div>
                        <ul className="input-list">
                            {Object.entries(record.inputs).map(([key, value]) => (
                                <li key={key}>
                                    <span className="input-key">{key.replace(/_/g, ' ')}</span>
                                    <span className="input-value">{value}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Result;
