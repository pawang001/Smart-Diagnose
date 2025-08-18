export const diseaseConfigs = {
    'breast-cancer': {
        displayName: "Breast Cancer",
        apiPath: "breast_cancer",
        description: "Predicts the likelihood of breast tumors being malignant or benign based on diagnostic measurements.",
        iconPath: "M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z",
        features: [
            // These names MUST match the columns your model was trained on
            { name: 'concave points_worst', type: 'number' },
            { name: 'perimeter_worst', type: 'number' },
            { name: 'concave points_mean', type: 'number' },
            { name: 'radius_worst', type: 'number' },
            { name: 'perimeter_mean', type: 'number' },
            { name: 'area_worst', type: 'number' },
            { name: 'radius_mean', type: 'number' },
        ],
    },
    'heart-disease': {
        displayName: "Heart Disease",
        apiPath: "heart_disease",
        description: "Assesses the risk of heart disease based on patient attributes and clinical measurements.",
        iconPath: "M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z",
        features: [
            // Note the use of 'select' type for categorical data
            { name: 'cp', type: 'select', label: 'Chest Pain Type', options: ['typical angina', 'atypical angina', 'non-anginal', 'asymptomatic'] },
            { name: 'ca', type: 'number', label: 'Major Vessels' },
            { name: 'oldpeak', type: 'number', label: 'Oldpeak' },
            { name: 'thal', type: 'select', label: 'Thalassemia', options: ['normal', 'fixed defect', 'reversable defect'] },
            { name: 'exang', type: 'select', label: 'Exercise Induced Angina', options: ['FALSE', 'TRUE'] },
            { name: 'sex', type: 'select', label: 'Sex', options: ['Male', 'Female'] },
            { name: 'age', type: 'number', label: 'Age' },
            { name: 'trestbps', type: 'number', label: 'Resting Blood Pressure' },
        ],
    },
    'diabetes': {
        displayName: "Diabetes",
        apiPath: "diabetes",
        description: "Evaluates the probability of diabetes based on diagnostic measures.",
        iconPath: "M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.362-1.44m4.662-2.946a8.25 8.25 0 00-4.662-2.946m4.662 2.946l-2.344 2.343m-2.322-4.685a8.25 8.25 0 00-4.662 2.946m0 0l-2.343 2.343m0 0a8.25 8.25 0 014.662-2.946",
        features: [
            { name: 'Glucose', type: 'number' },
            { name: 'BMI', type: 'number' },
            { name: 'Age', type: 'number' },
            { name: 'Insulin', type: 'number' },
            { name: 'BloodPressure', type: 'number' },
            { name: 'DiabetesPedigreeFunction', type: 'number' },
        ],
    },
};