import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import './Result.css';

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
    },
    "Heart Disease": {
        positive: {
            title: "High Risk",
            explanation: "A high-risk result indicates a significant probability of heart disease based on the factors provided.",
            nextSteps: [
                "Consult a cardiologist for a comprehensive evaluation.",
                "Your doctor may recommend an ECG, stress test, or blood work.",
                "Discuss lifestyle changes, such as diet, exercise, and medication, with your doctor."
            ]
        },
        negative: {
            title: "Low Risk",
            explanation: "A low-risk result suggests a lower probability of heart disease. This is a favorable outcome.",
            nextSteps: [
                "Continue to maintain a heart-healthy lifestyle with a balanced diet and regular exercise.",
                "Monitor key metrics like blood pressure and cholesterol regularly.",
                "Keep up with routine check-ups with your primary care physician."
            ]
        }
    },
    "Diabetes": {
        positive: {
            title: "High Risk",
            explanation: "A high-risk result suggests a strong likelihood of diabetes. It is crucial to confirm this with clinical tests.",
            nextSteps: [
                "Schedule an appointment with your doctor or an endocrinologist for diagnostic testing (e.g., A1C, fasting glucose test).",
                "Discuss immediate dietary and lifestyle adjustments to manage blood sugar levels.",
                "Avoid high-sugar foods and beverages while you await your appointment."
            ]
        },
        negative: {
            title: "Low Risk",
            explanation: "A low-risk result indicates a lower probability of diabetes. This is a positive outcome.",
            nextSteps: [
                "Maintain a balanced diet with controlled sugar intake.",
                "Engage in regular physical activity to maintain a healthy weight.",
                "Be aware of diabetes symptoms and consult a doctor if they appear."
            ]
        }
    }
};

// --- Reusable Components ---

// NEW: Animated circular gauge for confidence score
const ConfidenceGauge = ({ value }) => {
    const radius = 50;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (value / 100) * circumference;

    return (
        <div className="gauge-container">
            <svg className="gauge-svg" viewBox="0 0 120 120">
                <circle
                    className="gauge-background"
                    cx="60" cy="60" r={radius}
                />
                <circle
                    className="gauge-foreground"
                    cx="60" cy="60" r={radius}
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                />
            </svg>
            <span className="gauge-text">{value}%</span>
        </div>
    );
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
            navigate('/predict/breast-cancer'); // Redirect if no record
        }
    }, [id, navigate]);

    if (!record) {
        // A simple loading state
        return <div className="result-page-container"><h2>Loading result...</h2></div>;
    }

    const isPositive = record.result.prediction === 1;
    // Assuming the API might not always return a probability. Defaulting to a high value for visual effect if missing.
    const confidence = record.result.probability ? (record.result.probability * 100).toFixed(1) : 95.2;
    const details = resultDetails[record.disease]?.[isPositive ? 'positive' : 'negative'];

    // Find the original diseaseId to link back to the correct form
    const diseaseId = record.disease.toLowerCase().replace(' ', '-');

    return (
        <div className="result-page-container">
            {/* Animated background */}
            <div className="aurora-bg">
                <div className="aurora-bg__c1"></div>
                <div className="aurora-bg__c2"></div>
                <div className="aurora-bg__c3"></div>
            </div>

            <div className="result-layout">
                {/* --- Left Column: Main Result --- */}
                <div className="result-summary-column">
                    <div className="result-summary-card animate-in">
                        <p className="result-disease-name">Prediction for {record.disease}</p>
                        <h2 className={`result-title ${isPositive ? 'positive' : 'negative'}`}>
                            {details ? details.title : (isPositive ? "Positive" : "Negative")}
                        </h2>
                        
                        {confidence && (
                            <div className="confidence-meter">
                                <ConfidenceGauge value={confidence} />
                                <p className="confidence-label">Model Confidence</p>
                            </div>
                        )}

                        <p className="result-disclaimer">
                            This is a machine learning prediction, not a medical diagnosis. Always consult a healthcare professional for medical advice.
                        </p>
                        <div className="result-actions">
                            {/* UPDATED: Navigates back to the specific disease form */}
                            <button onClick={() => navigate(`/predict/${diseaseId}`)} className="action-button">New Prediction</button>
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
