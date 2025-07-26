import React, { useState } from 'react';
import axios from 'axios'; // Import axios
import './PredictionForm.css';
import Result from '../Result/Result';

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

const PredictionForm = () => {
  // IMPORTANT: Replace these with your actual feature names if they are different.
  const modelFeatures = [
    'concave points_worst', 'perimeter_worst', 'concave points_mean',
    'radius_worst', 'perimeter_mean', 'area_worst', 'radius_mean',
  ];

  const initialState = modelFeatures.reduce((acc, feature) => ({ ...acc, [feature]: '' }), {});
  
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});
  
  // New state for API interaction
  const [predictionResult, setPredictionResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    // Clear error for the field being edited
    if (errors[name]) {
      setErrors(prev => ({...prev, [name]: null}));
    }
  };
  
  // Function to validate all fields before submitting
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
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Don't submit if validation fails
    if (!validateForm()) {
        return;
    }
    
    setIsLoading(true);
    setApiError('');
    setPredictionResult(null);

    // Convert all form values from string to number for the API
    const processedData = Object.keys(formData).reduce((acc, key) => {
      acc[key] = parseFloat(formData[key]);
      return acc;
    }, {});

    try {
      // Make the API call to your Flask backend
      const response = await axios.post('http://127.0.0.1:5001/predict', processedData);
      setPredictionResult(response.data);
    } catch (error) {
      console.error('There was an error making the prediction:', error);
      setApiError('Failed to get a prediction. Please ensure the backend server is running.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="form-page-layout">
      <div className="form-column">
        <div className="form-card card">
          <div className="card-header">
            <Icon path="M9 4.5a.75.75 0 01.75.75v13.5a.75.75 0 01-1.5 0V5.25A.75.75 0 019 4.5zm6.75 0a.75.75 0 01.75.75v13.5a.75.75 0 01-1.5 0V5.25a.75.75 0 01.75-.75z" />
            <h2>Enter Patient Data</h2>
          </div>
          <form onSubmit={handleSubmit} className="prediction-form" noValidate>
            <div className="form-grid">
              {modelFeatures.map((feature) => (
                <InputField key={feature} name={feature} value={formData[feature]} onChange={handleInputChange} error={errors[feature]} />
              ))}
            </div>
            <button type="submit" className="predict-button" disabled={isLoading}>
              {isLoading ? 'Analyzing...' : 'Run Prediction'}
            </button>
          </form>
        </div>
      </div>

      <div className="results-column">
        <Result result={predictionResult} error={apiError} isLoading={isLoading} />
        
        <div className="past-records-card card">
           <div className="card-header">
             <Icon path="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            <h2>Past Records</h2>
          </div>
           <div className="placeholder-content">
            <p>Previous 5 results will be listed here.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PredictionForm;
