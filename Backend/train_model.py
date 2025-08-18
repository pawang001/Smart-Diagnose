# ==============================================================================
#  1. IMPORT NECESSARY LIBRARIES
# ==============================================================================
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
import joblib
import numpy as np

# ==============================================================================
#  2. DEFINE THE CORE MODEL TRAINING FUNCTION
# ==============================================================================
def train_and_save_model(data_file, target_column, model_prefix, top_n_features=8, columns_to_drop=None, map_target=None):
    """
    Loads a dataset, preprocesses the data, trains a machine learning model,
    and saves the model and its required feature columns to disk.

    This function is designed to be reusable for different diseases and datasets.
    It automatically handles text-based (categorical) features.

    Args:
        data_file (str): The path to the CSV data file.
        target_column (str): The name of the column to be predicted.
        model_prefix (str): A unique name used for saving model files (e.g., 'breast_cancer').
        top_n_features (int): The number of most important features to use for training.
        columns_to_drop (list, optional): A list of columns to remove from the data.
        map_target (dict, optional): A dictionary to map string labels to numbers (e.g., {'M': 1, 'B': 0}).
    """
    print(f"\n--- Training Model for: {model_prefix.replace('_', ' ').title()} ---")

    # --- Step 2a: Load Data ---
    try:
        df = pd.read_csv(data_file)
    except FileNotFoundError:
        print(f"ERROR: Data file '{data_file}' not found. Skipping this model.")
        return

    # --- Step 2b: Preprocess Data ---
    # Drop any specified non-feature columns like 'id' or 'dataset'.
    if columns_to_drop:
        df = df.drop(columns=columns_to_drop, errors='ignore')

    # If a mapping is provided, convert text-based target labels to numbers.
    if map_target and df[target_column].dtype == 'object':
        df[target_column] = df[target_column].map(map_target)

    # Remove any rows where the target value is missing.
    df.dropna(subset=[target_column], inplace=True)
    
    # Ensure the target column is of integer type.
    df[target_column] = df[target_column].astype(int)
    
    # For some datasets, the target might have multiple positive values (e.g., 1, 2, 3, 4).
    # We convert this into a simple binary problem: 0 for negative, 1 for positive.
    if model_prefix == 'heart_disease':
        df[target_column] = df[target_column].apply(lambda x: 1 if x > 0 else 0)

    # Separate the data into features (X) and the target variable (y).
    X = df.drop(target_column, axis=1)
    y = df[target_column]

    # Convert all text-based feature columns into numerical format using one-hot encoding.
    # This is a critical step for machine learning models to work.
    X = pd.get_dummies(X, drop_first=True)
    
    # Fill any remaining missing feature values with the median of their respective column.
    X.fillna(X.median(), inplace=True)

    # --- Step 2c: Select the Most Important Features ---
    # We use a preliminary RandomForest model to evaluate which features are most predictive.
    feature_selector = RandomForestClassifier(n_estimators=100, random_state=42)
    feature_selector.fit(X, y)
    importances = pd.Series(feature_selector.feature_importances_, index=X.columns)
    
    # Ensure we don't try to select more features than are available.
    num_available_features = len(X.columns)
    actual_top_n = min(top_n_features, num_available_features)
    
    # Get the names of the top N most important features.
    top_features = importances.nlargest(actual_top_n)
    top_feature_names = list(top_features.index)

    print(f"Selected Top {actual_top_n} features:")
    print(top_features)

    # --- Step 2d: Train the Final Model ---
    # Create a new DataFrame containing only the most important features.
    X_top_features = X[top_feature_names]
    
    # Train the final model using only this refined set of features.
    final_model = RandomForestClassifier(n_estimators=100, random_state=42)
    final_model.fit(X_top_features, y)

    # --- Step 2e: Save the Model and Columns ---
    # Save the trained model object to a file.
    joblib.dump(final_model, f'{model_prefix}_model.joblib')
    
    # CRITICAL: Save the list of feature columns that the final model was trained on.
    # The API will use this to ensure incoming data has the correct format.
    joblib.dump(top_feature_names, f'{model_prefix}_columns.joblib')

    print(f"Model '{model_prefix}' saved successfully!")
    print("----------------------------------------------------")

# ==============================================================================
#  3. EXECUTE THE TRAINING PROCESS
# ==============================================================================
# This block runs only when the script is executed directly (`python train_model.py`).
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
        columns_to_drop=['id', 'dataset']
    )

    # --- Train Diabetes Model ---
    train_and_save_model(
        data_file='diabetes_data.csv',
        target_column='Outcome',
        model_prefix='diabetes'
    )
