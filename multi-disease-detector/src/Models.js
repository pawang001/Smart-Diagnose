// This file centralizes the configuration for each prediction model.
// It makes the PredictionPage component cleaner and easier to manage.

export const modelConfig = {
    "Breast Cancer": {
        endpoint: 'http://127.0.0.1:5001/predict/breast_cancer', // Example endpoint
        features: [
            'concave points_worst', 'perimeter_worst', 'concave points_mean',
            'radius_worst', 'perimeter_mean', 'area_worst', 'radius_mean',
        ],
    },
    "Heart Disease": {
        endpoint: 'http://127.0.0.1:5001/predict/heart_disease',
        features: [
            'age', 'sex', 'cp', 'trestbps', 'chol', 'fbs', 
            'restecg', 'thalach', 'exang', 'oldpeak', 'slope', 'ca', 'thal'
        ],
    },
    "Diabetes": {
        endpoint: 'http://127.0.0.1:5001/predict/diabetes',
        features: [
            'Pregnancies', 'Glucose', 'BloodPressure', 'SkinThickness', 
            'Insulin', 'BMI', 'DiabetesPedigreeFunction', 'Age'
        ],
    },
    "Kidney Disease": {
        endpoint: 'http://127.0.0.1:5001/predict/kidney_disease',
        features: [
            'age', 'blood_pressure', 'specific_gravity', 'albumin', 
            'sugar', 'red_blood_cells', 'pus_cell', 'pus_cell_clumps'
        ],
    },
    // Add other disease models here as you create them
};
