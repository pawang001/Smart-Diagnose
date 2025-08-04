from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd
import numpy as np

# Initialize the Flask app
app = Flask(__name__)
CORS(app) # Enable CORS for all routes

# --- LOAD THE MODEL AND COLUMNS ---
# Load the trained model and the column list right when the app starts
try:
    model = joblib.load('disease_predictor.joblib')
    model_columns = joblib.load('model_columns.joblib')
    print("Model and columns loaded successfully.")
except Exception as e:
    print(f"❌ Error loading model or columns: {e}")
    model = None
    model_columns = None

# --- CREATE THE PREDICTION ROUTE ---
@app.route('/predict', methods=['POST'])
def predict():
    # Ensure the model is loaded before trying to predict
    if not model or not model_columns:
        return jsonify({'error': 'Model is not loaded, check server logs.'}), 500

    try:
        # 1. Get the JSON data sent from the frontend
        # We expect the data to be a dictionary of feature names and their values
        json_data = request.get_json()

        if not json_data:
            return jsonify({'error': 'No input data provided.'}), 400

        # 2. Create a pandas DataFrame from the input data
        # The 'index=[0]' is important to structure it as a single row
        input_df = pd.DataFrame(json_data, index=[0])

        # 3. Ensure the order of columns matches the model's training order
        # This is a crucial step!
        query_df = input_df.reindex(columns=model_columns, fill_value=0)

        # 4. Make a prediction
        prediction_raw = model.predict(query_df)

        # The prediction is an array (e.g., [1]), so we convert it to a standard Python integer
        result = int(prediction_raw[0])

        # 5. Return the prediction as JSON
        # We'll return 1 for Malignant and 0 for Benign
        return jsonify({'prediction': result})

    except Exception as e:
        # Catch any other errors during prediction
        return jsonify({'error': f'An error occurred during prediction: {str(e)}'}), 500

# This allows you to run the app directly
if __name__ == '__main__':
    # Use port 5001 to avoid conflicts with the React frontend later
    app.run(debug=False, port=5001)