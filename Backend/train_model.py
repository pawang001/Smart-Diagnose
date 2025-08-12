# train_model.py (Final Version)

import pandas as pd
from sklearn.ensemble import RandomForestClassifier
import joblib
import numpy as np

def train_and_save_model(data_file, target_column, model_prefix, top_n_features=8, columns_to_drop=None, map_target=None):
    """
    Loads data, preprocesses it, trains a model, and saves it.
    This version handles non-numeric (categorical) data automatically.
    """
    print(f"\n--- Training Model for: {model_prefix.replace('_', ' ').title()} ---")

    # --- 1. Load Data ---
    try:
        df = pd.read_csv(data_file)
    except FileNotFoundError:
        print(f"❌ Error: Data file '{data_file}' not found. Skipping this model.")
        return

    # --- 2. Preprocess Data ---
    if columns_to_drop:
        df = df.drop(columns=columns_to_drop, errors='ignore')

    if map_target and df[target_column].dtype == 'object':
        df[target_column] = df[target_column].map(map_target)

    df.dropna(subset=[target_column], inplace=True)
    
    # Convert target to integer type
    df[target_column] = df[target_column].astype(int)
    
    # In some heart datasets, the target 'num' can be > 1. 
    # We will convert it to a binary classification: 0 = no disease, 1 = disease present.
    if model_prefix == 'heart_disease':
        df[target_column] = df[target_column].apply(lambda x: 1 if x > 0 else 0)


    # Separate features (X) and target (y)
    X = df.drop(target_column, axis=1)
    y = df[target_column]

    # One-Hot Encode categorical features (convert text to numbers)
    # This is a crucial step for models to work
    X = pd.get_dummies(X, drop_first=True)
    
    # Fill any remaining missing values with the median of the column
    X.fillna(X.median(), inplace=True)

    # --- 3. Find Top Features ---
    feature_selector = RandomForestClassifier(n_estimators=100, random_state=42)
    feature_selector.fit(X, y)
    importances = pd.Series(feature_selector.feature_importances_, index=X.columns)
    
    # Make sure we don't select more features than available
    num_available_features = len(X.columns)
    actual_top_n = min(top_n_features, num_available_features)
    
    top_features = importances.nlargest(actual_top_n)
    top_feature_names = list(top_features.index)

    print(f"Selected Top {actual_top_n} features:")
    print(top_features)

    # --- 4. Train Final Model on Top Features---
    X_top_features = X[top_feature_names]
    final_model = RandomForestClassifier(n_estimators=100, random_state=42)
    final_model.fit(X_top_features, y)

    # --- 5. Save Model and Columns ---
    joblib.dump(final_model, f'{model_prefix}_model.joblib')
    joblib.dump(top_feature_names, f'{model_prefix}_columns.joblib')

    print(f"✅ Model '{model_prefix}' saved successfully!")
    print("----------------------------------------------------")


if __name__ == '__main__':
    # --- Train Breast Cancer Model ---
    train_and_save_model(
        data_file='breast_cancer_data.csv',
        target_column='diagnosis',
        model_prefix='breast_cancer',
        columns_to_drop=['id'],
        map_target={'M': 1, 'B': 0}
    )

    # --- Train Heart Disease Model ---
    train_and_save_model(
        data_file='heart_disease_data.csv',
        target_column='num',
        model_prefix='heart_disease',
        columns_to_drop=['id', 'dataset'] # We drop 'id' and 'dataset' columns
    )

    # --- Train Diabetes Model ---
    train_and_save_model(
        data_file='diabetes_data.csv',
        target_column='Outcome',
        model_prefix='diabetes'
    )