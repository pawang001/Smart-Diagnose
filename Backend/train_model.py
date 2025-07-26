# train_model.py

import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
import joblib

print("Script started: Training a user-friendly model...")

# --- Configuration ---
# You can change this number to select more or fewer features.
# Let's start with the top 7 most important ones.
TOP_N_FEATURES = 7
DATA_FILE = 'breast_cancer_data.csv'
TARGET_COLUMN = 'diagnosis' # IMPORTANT: Change this to your dataset's target column name (e.g., 'outcome', 'target')

# --- 1. Load the Data ---
try:
    df = pd.read_csv(DATA_FILE)
except FileNotFoundError:
    print(f"Error: The data file '{DATA_FILE}' was not found in the backend folder.")
    exit()

# Handle potential non-numeric or missing data if necessary
# For this dataset, we'll assume the columns are mostly numeric.
# The 'id' column is usually not useful for prediction.
if 'id' in df.columns:
    df = df.drop('id', axis=1)

# Some datasets use 'M' for Malignant and 'B' for Benign.
# Our model needs numbers (0 or 1), so we convert them.
if df[TARGET_COLUMN].dtype == 'object':
    df[TARGET_COLUMN] = df[TARGET_COLUMN].map({'M': 1, 'B': 0})


# --- 2. Find the Most Important Features ---
print("Finding the most important features...")

X = df.drop(TARGET_COLUMN, axis=1)
y = df[TARGET_COLUMN]

# We use a RandomForestClassifier to determine feature importance.
# It's excellent for this kind of analysis.
feature_selector = RandomForestClassifier(n_estimators=100, random_state=42)
feature_selector.fit(X, y)

# Create a series with feature names and their importance scores
importances = pd.Series(feature_selector.feature_importances_, index=X.columns)

# Select the top N features
top_features = importances.nlargest(TOP_N_FEATURES)
top_feature_names = list(top_features.index)

print(f"\nSelected the Top {TOP_N_FEATURES} most important features:")
print(top_features)
print("\nWe will build our model using only these features.")


# --- 3. Train a New Model with Only the Top Features ---
print("\nTraining a new model using only the selected features...")

# Create a new DataFrame with only the most important features
X_top_features = X[top_feature_names]

# We can use the same model (or a different one) for the final prediction
# Let's stick with RandomForest as it's powerful.
final_model = RandomForestClassifier(n_estimators=100, random_state=42)
final_model.fit(X_top_features, y)


# --- 4. Save the New Model and its Columns ---
print("\nSaving the new model and its column list...")

# Save the trained model
joblib.dump(final_model, 'disease_predictor.joblib')

# CRITICAL: Save the list of the columns we actually used for the final model
joblib.dump(top_feature_names, 'model_columns.joblib')

print("\n----------------------------------------------------")
print("✅ New user-friendly model trained and saved successfully!")
print("The API will now only require these fields:")
for name in top_feature_names:
    print(f"- {name}")
print("----------------------------------------------------")