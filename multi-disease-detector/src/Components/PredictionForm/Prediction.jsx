import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import Layout from '../../Components/Layout/Layout';
import Footer from '../../Components/Footer/Footer';
import './Prediction.css'; // We can continue to use the same CSS file

// --- Reusable Child Components ---

const Icon = ({ path }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="section-icon">
        <path fillRule="evenodd" d={path} clipRule="evenodd" />
    </svg>
);

const InputField = ({ name, value, onChange, error }) => (
    <div className="input-group">
        <label htmlFor={name}>{name.replace(/_/g, ' ')}</label>
        <input type="number" id={name} name={name} value={value} onChange={onChange} placeholder="0.0" step="any" className={error ? 'input-error' : ''} />
        {error && <span className="error-message">{error}</span>}
    </div>
);

// --- Main Page Component ---

// This configuration object is the "single source of truth" for your models.
const diseaseConfig = {
  'Breast Cancer': {
    modelName: 'breast_cancer',
    features: [
      'concave points_worst', 'perimeter_worst', 'concave points_mean',
      'radius_worst', 'perimeter_mean', 'area_worst', 'radius_mean'
    ]
  },
  'Heart Disease': {
    modelName: 'heart_disease',
    features: ['age', 'sex', 'cp', 'trestbps', 'chol', 'fbs', 'restecg', 'thalach', 'exang', 'oldpeak', 'slope', 'ca', 'thal']
  },
  'Diabetes': {
    modelName: 'diabetes',
    features: ['Pregnancies', 'Glucose', 'BloodPressure', 'SkinThickness', 'Insulin', 'BMI', 'DiabetesPedigreeFunction', 'Age']
  },
  'Kidney Disease': {
      modelName: 'kidney_disease',
      features: ['age', 'blood_pressure', 'specific_gravity', 'albumin', 'sugar', 'red_blood_cells', 'pus_cell', 'pus_cell_clumps', 'bacteria', 'blood_glucose_random']
  }
};

const Prediction = () => {
    const navigate = useNavigate();

    // --- All State Management is now in this single component ---
    const [activeDisease, setActiveDisease] = useState('Breast Cancer');
    
    const currentConfig = diseaseConfig[activeDisease];
    const modelFeatures = currentConfig.features;
    const apiEndpoint = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5001/predict';
    
    const initialState = modelFeatures.reduce((acc, feature) => ({ ...acc, [feature]: '' }), {});
    
    const [formData, setFormData] = useState(initialState);
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [apiError, setApiError] = useState('');

    // Effect to reset the form when the active disease changes
    useEffect(() => {
        setFormData(initialState);
        setErrors({});
        setApiError('');
    }, [activeDisease]);

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

        const processedData = {
            model_name: currentConfig.modelName,
            features: Object.fromEntries(Object.entries(formData).map(([k, v]) => [k, parseFloat(v)]))
        };

        try {
            const response = await axios.post(apiEndpoint, processedData);
            const resultData = response.data;

            const newRecord = {
                id: uuidv4(),
                disease: activeDisease,
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
        <>
            <Layout
                diseases={Object.keys(diseaseConfig)}
                activeDisease={activeDisease}
                onDiseaseSelect={setActiveDisease}
            >
                {/* The form's JSX is now directly inside the page component */}
                <div className="prediction-page-container">
                    <div className="prediction-card">
                        <div className="prediction-card-header">
                            <Icon path="M9 4.5a.75.75 0 01.75.75v13.5a.75.75 0 01-1.5 0V5.25A.75.75 0 019 4.5zm6.75 0a.75.75 0 01.75.75v13.5a.75.75 0 01-1.5 0V5.25a.75.75 0 01.75-.75z" />
                            <h2>{activeDisease} Prediction</h2>
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
            </Layout>
        </>
    );
};

export default Prediction;
