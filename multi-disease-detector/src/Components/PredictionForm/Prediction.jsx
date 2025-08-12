import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams, Navigate } from "react-router-dom";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { diseaseConfigs } from "./modelConfig"; // Import the configuration
import "./Prediction.css";

// A generic Icon component for reusability
const Icon = ({ path }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="section-icon"
  >
    <path fillRule="evenodd" d={path} clipRule="evenodd" />
  </svg>
);

// Reusable InputField for 'number' type
const InputField = ({ name, label, value, onChange, error }) => (
  <div className="input-group">
    <label htmlFor={name}>{label}</label>
    <input
      type="number"
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      placeholder="0.0"
      step="any"
      className={error ? "input-error" : ""}
    />
    {error && <span className="error-message">{error}</span>}
  </div>
);

// Reusable SelectField for 'select' type
const SelectField = ({ name, label, value, onChange, error, options }) => (
  <div className="input-group">
    <label htmlFor={name}>{label}</label>
    <select
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      className={error ? "input-error" : ""}
    >
      <option value="" disabled>
        -- Select --
      </option>
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
    {error && <span className="error-message">{error}</span>}
  </div>
);

// Loading spinner component for the button
const Spinner = () => (
    <div className="spinner"></div>
);


const Prediction = () => {
  const { diseaseId } = useParams(); // Get the disease ID from the URL
  const navigate = useNavigate();

  // Find the correct configuration for the current disease
  const modelConfig = useMemo(() => diseaseConfigs[diseaseId], [diseaseId]);

  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  // This effect runs when the diseaseId changes, resetting the form
  useEffect(() => {
    if (modelConfig) {
      const initialState = modelConfig.features.reduce((acc, feature) => {
        acc[feature.name] = "";
        return acc;
      }, {});
      setFormData(initialState);
      setErrors({});
      setApiError("");
    }
  }, [diseaseId, modelConfig]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    modelConfig.features.forEach((feature) => {
      if (!formData[feature.name]) {
        newErrors[feature.name] = "This field is required.";
      } else if (
        feature.type === "number" &&
        isNaN(parseFloat(formData[feature.name]))
      ) {
        newErrors[feature.name] = "Please enter a valid number.";
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setApiError("");

    const processedData = modelConfig.features.reduce((acc, feature) => {
      const value = formData[feature.name];
      // Convert numbers to float, keep selects as strings for the backend
      acc[feature.name] = feature.type === "number" ? parseFloat(value) : value;
      return acc;
    }, {});

    const apiEndpoint = `${
      import.meta.env.VITE_API_URL || "http://127.0.0.1:5001"
    }/predict/${modelConfig.apiPath}`;

    try {
      const response = await axios.post(apiEndpoint, processedData);
      const resultData = response.data;

      const newRecord = {
        id: uuidv4(),
        disease: modelConfig.displayName,
        date: new Date().toISOString(),
        inputs: formData, // Save the user-friendly inputs
        result: resultData,
      };

      const history =
        JSON.parse(localStorage.getItem("predictionHistory")) || [];
      localStorage.setItem(
        "predictionHistory",
        JSON.stringify([newRecord, ...history].slice(0, 5))
      );

      navigate(`/result/${newRecord.id}`);
    } catch (error) {
      console.error("There was an error making the prediction:", error);
      const errorMsg =
        error.response?.data?.error ||
        "Please ensure the backend server is running and accessible.";
      setApiError(`Failed to get a prediction. ${errorMsg}`);
    } finally {
      setIsLoading(false);
    }
  };

  // If the diseaseId from the URL is not valid, redirect to home or a 404 page
  if (!modelConfig) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="prediction-page-container">
        {/* These are for the animated background */}
        <div className="aurora-bg">
            <div className="aurora-bg__c1"></div>
            <div className="aurora-bg__c2"></div>
            <div className="aurora-bg__c3"></div>
        </div>
      <div className="prediction-card">
        <div className="prediction-card-header">
          <Icon path={modelConfig.iconPath} />
          <h2>{modelConfig.displayName} Prediction</h2>
        </div>
        <p className="prediction-description">{modelConfig.description}</p>
        <form onSubmit={handleSubmit} className="prediction-form" noValidate>
          <div className="form-grid">
            {modelConfig.features.map((feature, index) => {
              // Applying a style for staggered animation
              const animationStyle = { animationDelay: `${index * 50}ms` };

              const commonProps = {
                key: feature.name,
                name: feature.name,
                label: feature.label || feature.name.replace(/_/g, " "),
                value: formData[feature.name] || "",
                onChange: handleInputChange,
                error: errors[feature.name],
              };
              if (feature.type === "select") {
                return (
                  <div style={animationStyle} className="form-field-animation">
                    <SelectField {...commonProps} options={feature.options} />
                  </div>
                );
              }
              return (
                <div style={animationStyle} className="form-field-animation">
                    <InputField {...commonProps} />
                </div>
              );
            })}
          </div>
          {apiError && <div className="api-error-box">{apiError}</div>}
          <button type="submit" className="predict-button" disabled={isLoading}>
            {isLoading ? (
                <>
                    <Spinner />
                    Analyzing...
                </>
            ) : (
                "Run Prediction"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Prediction;
