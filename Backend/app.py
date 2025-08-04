import os
import joblib
import pandas as pd
from flask import Flask, request, jsonify
from flask_cors import CORS

# Initialize the Flask app
app = Flask(__name__)

# --- Configure CORS for Production ---
# This is a critical security step. It tells your backend to ONLY accept API requests
# from your deployed Vercel frontend and your local development server.
CORS(app, origins=["https://smart-diagnose.vercel.app", "http://localhost:5173"])


# --- Load All Models at Startup ---
# This code automatically finds and loads all your trained models.
# To add a new disease, just add the model files to this 'Backend' folder.
models = {}
model_columns = {}
model_path = '.' # This means the current directory

print("Initializing server: Loading all available models...")
try:
    # Scan the current directory for all files ending with '_model.joblib'
    for filename in os.listdir(model_path):
        if filename.endswith("_model.joblib"):
            # Extract the model name (e.g., 'breast_cancer') from the filename
            model_name = filename.replace("_model.joblib", "")
            
            model_file_path = os.path.join(model_path, filename)
            columns_file_path = os.path.join(model_path, f"{model_name}_columns.joblib")
            
            # Ensure both the model and its columns file exist before loading
            if os.path.exists(columns_file_path):
                models[model_name] = joblib.load(model_file_path)
                model_columns[model_name] = joblib.load(columns_file_path)
                print(f"✅ Successfully loaded model: '{model_name}'")
            else:
                print(f"⚠️ Warning: Model file '{filename}' found but missing corresponding columns file '{model_name}_columns.joblib'.")

except Exception as e:
    print(f"❌ An error occurred during model loading: {e}")


# --- Main Prediction Route ---
@app.route('/predict', methods=['POST'])
def predict():
    """
    Receives a request with a model name and feature data,
    returns a prediction and confidence score.
    """
    try:
        json_data = request.get_json()
        
        # The frontend sends a JSON object with these two keys
        model_name = json_data.get('model_name')
        features = json_data.get('features')

        # Basic validation of the incoming request
        if not model_name or not features:
            return jsonify({'error': 'Missing model_name or features in the request.'}), 400

        # Check if the requested model is loaded and available
        if model_name not in models:
            return jsonify({'error': f"Model '{model_name}' is not available on the server."}), 404

        # Select the correct model and its column list
        model = models[model_name]
        columns = model_columns[model_name]

        # Create a pandas DataFrame from the input features
        input_df = pd.DataFrame(features, index=[0])
        
        # Ensure the DataFrame has the correct columns in the correct order, filling missing ones with 0
        query_df = input_df.reindex(columns=columns, fill_value=0)
        
        # Make the prediction
        prediction_raw = model.predict(query_df)
        result = int(prediction_raw[0])

        # Get the prediction probability (confidence score)
        if hasattr(model, 'predict_proba'):
            # The model returns probabilities for [class 0, class 1]. We want the probability for class '1'.
            probability = model.predict_proba(query_df)[0][1]
        else:
            # If the model type doesn't support probability, send a default value
            probability = 0.95 

        # Send the successful response back to the frontend
        return jsonify({'prediction': result, 'probability': probability})

    except Exception as e:
        # Log the detailed error on the server for debugging
        print(f"❌ An error occurred during prediction: {e}")
        # Return a generic error message to the user for security
        return jsonify({'error': 'An internal error occurred. Please check server logs.'}), 500

# This runs the app
if __name__ == '__main__':
    # Debug mode is set to False for production deployment
    app.run(debug=False, port=5001)
