import React, { useState, useEffect } from 'react';
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

// A reusable input field component
const InputField = ({ name, value, onChange, error }) => (
    <div className="input-group">
        <label htmlFor={name}>{name.replace(/_/g, ' ')}</label>
        <input type="number" id={name} name={name} value={value} onChange={onChange} placeholder="0.0" step="any" className={error ? 'input-error' : ''} />
        {error && <span className="error-message">{error}</span>}
    </div>
);

// The component now accepts props to make it dynamic
const Prediction = ({ diseaseConfig, diseaseName }) => {
    const navigate = useNavigate();

    // The features are now taken from the config prop, making the component dynamic
    const modelFeatures = diseaseConfig.features;
    const apiEndpoint = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5001/predict';

    // The initial state is now built dynamically based on the features for the selected disease
    const initialState = modelFeatures.reduce((acc, feature) => ({ ...acc, [feature]: '' }), {});
    
    const [formData, setFormData] = useState(initialState);
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [apiError, setApiError] = useState('');

    // This crucial effect resets the form whenever the user selects a new disease in the sidebar
    useEffect(() => {
        setFormData(initialState);
        setErrors({});
        setApiError('');
    }, [diseaseName]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
        if (errors[name]) setErrors(prev => ({...prev, [name]: null}));
    };
    
    const validateForm = () => {
        const newErrors = {};
        modelFeatures.forEach(feature => {
            if (!formData[feature] || isNaN(parseFloat(formData[feature]))) {
                newErrors[feature] = 'Please enter a valid number.';
            }
        });
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        
        setIsLoading(true);
        setApiError('');

        // Create the correct nested data structure that the backend expects
        const processedData = {
            model_name: diseaseConfig.modelName,
            features: Object.fromEntries(Object.entries(formData).map(([k, v]) => [k, parseFloat(v)]))
        };

        try {
            const response = await axios.post(apiEndpoint, processedData);
            const resultData = response.data;

            const newRecord = {
                id: uuidv4(),
                disease: diseaseName, // Use the dynamic disease name
                date: new Date().toISOString(),
                inputs: processedData.features,
                result: resultData,
            };

            const history = JSON.parse(localStorage.getItem('predictionHistory')) || [];
            const updatedHistory = [newRecord, ...history].slice(0, 5);
            localStorage.setItem('predictionHistory', JSON.stringify(updatedHistory));
            
            navigate(`/result/${newRecord.id}`);
            
        } catch (error) {
            console.error('Prediction Error:', error);
            setApiError('Failed to get a prediction. Please ensure the backend server is running and check the console.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="prediction-page-container">
            <div className="prediction-card">
                <div className="prediction-card-header">
                    <Icon path="M9 4.5a.75.75 0 01.75.75v13.5a.75.75 0 01-1.5 0V5.25A.75.75 0 019 4.5zm6.75 0a.75.75 0 01.75.75v13.5a.75.75 0 01-1.5 0V5.25a.75.75 0 01.75-.75z" />
                    {/* The title is now dynamic */}
                    <h2>{diseaseName} Prediction</h2>
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
