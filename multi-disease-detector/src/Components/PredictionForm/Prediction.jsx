import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import './Prediction.css';

// A generic Icon component for reusability
const Icon = ({ path }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="section-icon">
        <path fillRule="evenodd" d={path} clipRule="evenodd" />
    </svg>
);

// A reusable input field component with error display
const InputField = ({ name, value, onChange, error }) => (
    <div className="input-group">
        <label htmlFor={name}>{name.replace(/_/g, ' ')}</label>
        <input
            type="number"
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            placeholder="0.0"
            step="any"
            className={error ? 'input-error' : ''}
        />
        {error && <span className="error-message">{error}</span>}
    </div>
);


const Prediction = () => {
    const navigate = useNavigate();
    
    // Hardcoded for Breast Cancer model
    const modelFeatures = [
        'concave points_worst', 'perimeter_worst', 'concave points_mean',
        'radius_worst', 'perimeter_mean', 'area_worst', 'radius_mean',
    ];
    const apiEndpoint = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5001/predict';

    const initialState = modelFeatures.reduce((acc, feature) => ({ ...acc, [feature]: '' }), {});
    
    const [formData, setFormData] = useState(initialState);
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [apiError, setApiError] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({...prev, [name]: null}));
        }
    };
    
    const validateForm = () => {
        const newErrors = {};
        let isValid = true;
        modelFeatures.forEach(feature => {
            if (!formData[feature] || isNaN(parseFloat(formData[feature]))) {
                newErrors[feature] = 'Please enter a valid number.';
                isValid = false;
            }
        });
        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            return;
        }
        
        setIsLoading(true);
        setApiError('');

        const processedData = Object.keys(formData).reduce((acc, key) => {
            acc[key] = parseFloat(formData[key]);
            return acc;
        }, {});

        try {
            const response = await axios.post(apiEndpoint, processedData);
            const resultData = response.data;

            const newRecord = {
                id: uuidv4(),
                disease: "Breast Cancer", // Hardcoded disease name
                date: new Date().toISOString(),
                inputs: processedData,
                result: resultData,
            };

            const history = JSON.parse(localStorage.getItem('predictionHistory')) || [];
            const updatedHistory = [newRecord, ...history].slice(0, 5);
            localStorage.setItem('predictionHistory', JSON.stringify(updatedHistory));
            
            navigate(`/result/${newRecord.id}`);
            
        } catch (error) {
            console.error('There was an error making the prediction:', error);
            setApiError('Failed to get a prediction. Please ensure the backend server is running.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="prediction-page-container">
            <div className="prediction-card">
                <div className="prediction-card-header">
                    <Icon path="M9 4.5a.75.75 0 01.75.75v13.5a.75.75 0 01-1.5 0V5.25A.75.75 0 019 4.5zm6.75 0a.75.75 0 01.75.75v13.5a.75.75 0 01-1.5 0V5.25a.75.75 0 01.75-.75z" />
                    <h2>Breast Cancer Prediction</h2>
                </div>
                <form onSubmit={handleSubmit} className="prediction-form" noValidate>
                    <div className="form-grid">
                        {modelFeatures.map((feature) => (
                            <InputField key={feature} name={feature} value={formData[feature]} onChange={handleInputChange} error={errors[feature]} />
                        ))}
                    </div>
                    {apiError && <div className="api-error-box">{apiError}</div>}
                    <button type="submit" className="predict-button" disabled={isLoading}>
                        {isLoading ? 'Analyzing...' : 'Run Prediction'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Prediction;
