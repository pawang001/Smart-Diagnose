# ==============================================================================
#   1. IMPORT NECESSARY LIBRARIES
# ==============================================================================
from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd

# ==============================================================================
#   2. INITIALIZE THE FLASK APPLICATION & CORS
# ==============================================================================
# Create an instance of the Flask class. This is the core of our web application.
app = Flask(__name__)

# Configure Cross-Origin Resource Sharing (CORS) to allow our frontend to
# communicate with this backend API. This is a crucial security feature.
allowed_origins = [
    "https://smart-diagnose.vercel.app",  # Your deployed frontend URL
    "http://localhost:5173"              # Your local development frontend URL
]

# Apply CORS settings specifically to all routes under '/predict/'
CORS(app, resources={r"/predict/*": {"origins": allowed_origins}})

# ==============================================================================
#   3. LOAD THE TRAINED MACHINE LEARNING MODELS
# ==============================================================================
# A dictionary to hold the loaded model objects (e.g., the RandomForestClassifier)
models = {}
# A dictionary to hold the list of feature columns each model was trained on
model_columns = {}

# A list of the base names for our models. The script will look for files like
# 'breast_cancer_model.joblib', 'breast_cancer_columns.joblib', etc.
model_names = ['breast_cancer', 'heart_disease', 'diabetes']

# Loop through each model name to load its files from the disk at startup.
print("--- Loading Machine Learning Models ---")
for name in model_names:
    try:
        models[name] = joblib.load(f'{name}_model.joblib')
        model_columns[name] = joblib.load(f'{name}_columns.joblib')
        print(f"Model '{name}' loaded successfully.")
    except FileNotFoundError:
        print(f"WARNING: Model files for '{name}' not found. This endpoint will be disabled.")
    except Exception as e:
        print(f"ERROR loading model '{name}': {e}")
print("---------------------------------------")

# ==============================================================================
#   4. DEFINE THE CORE PREDICTION LOGIC
# ==============================================================================
def make_prediction(model_name):
    """
    A generic function that handles the prediction logic for any given model.
    Args:
        model_name (str): The key for the model to use (e.g., 'breast_cancer').
    Returns:
        A JSON response with the prediction or an error message.
    """
    # First, check if the requested model was successfully loaded at startup.
    if model_name not in models:
        error_response = {'error': f"The '{model_name}' model is not available on the server."}
        return jsonify(error_response), 503  # 503 Service Unavailable

    try:
        # Get the JSON data sent from the frontend in the request body.
        json_data = request.get_json()
        if not json_data:
            return jsonify({'error': 'No input data provided.'}), 400 # 400 Bad Request

        # Convert the incoming JSON data into a pandas DataFrame.
        input_df = pd.DataFrame(json_data, index=[0])

        # Get the specific columns required for this model.
        required_columns = model_columns[model_name]
        
        # Reorder the DataFrame to match the exact column order the model was
        # trained on. This is a critical step! `fill_value=0` handles any
        # missing one-hot encoded columns.
        query_df = input_df.reindex(columns=required_columns, fill_value=0)

        # Use the loaded model to make a prediction.
        model = models[model_name]
        prediction_raw = model.predict(query_df)
        
        # The prediction is a NumPy array (e.g., [1]), so we convert it to a standard Python integer.
        result = int(prediction_raw[0])

        # Return the final prediction in a JSON format.
        return jsonify({'prediction': result})

    except Exception as e:
        # Catch any other unexpected errors during the process.
        error_response = {'error': f'An error occurred during prediction: {str(e)}'}
        return jsonify(error_response), 500 # 500 Internal Server Error

# ==============================================================================
#   5. CREATE THE API ROUTES (ENDPOINTS)
# ==============================================================================
# Each route corresponds to a specific URL that the frontend will call.

@app.route('/predict/breast_cancer', methods=['POST'])
def predict_breast_cancer():
    """Endpoint for breast cancer predictions."""
    return make_prediction('breast_cancer')

@app.route('/predict/heart_disease', methods=['POST'])
def predict_heart_disease():
    """Endpoint for heart disease predictions."""
    return make_prediction('heart_disease')

@app.route('/predict/diabetes', methods=['POST'])
def predict_diabetes():
    """Endpoint for diabetes predictions."""
    return make_prediction('diabetes')

# A "health check" route is good practice. It allows you to easily check if the
# API is running and which models have been loaded.
@app.route('/', methods=['GET'])
def health_check():
    """A simple health check endpoint."""
    loaded_models = list(models.keys())
    return jsonify({
        "status": "API is running",
        "available_models": loaded_models
    })

# ==============================================================================
#   6. RUN THE FLASK APPLICATION
# ==============================================================================
# The `if __name__ == '__main__':` block ensures that this code only runs when
# the script is executed directly (e.g., `python app.py`).
if __name__ == '__main__':
    # Starts the Flask development server.
    # `debug=True` enables auto-reloading when you save changes.
    # `port=5001` specifies which port the server should run on.
    app.run(debug=True, port=5001)
