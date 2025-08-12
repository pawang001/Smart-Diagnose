from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd

# Initialize the Flask app
app = Flask(__name__)

# This list contains the URLs that are allowed to make requests to your API.
allowed_origins = [
    "https://smart-diagnose.vercel.app",  # Your deployed frontend
    "http://localhost:5173"              # Your local development frontend
]

cors = CORS(app, resources={
    r"/predict/*": {
        "origins": allowed_origins
    }
})

# ... (the rest of your app.py code remains the same) ...

# --- LOAD MODELS ---
# A dictionary to hold our models and their required columns
models = {}
model_columns = {}
# List of model prefixes you trained in train_model.py
model_names = ['breast_cancer', 'heart_disease', 'diabetes']

for name in model_names:
    try:
        models[name] = joblib.load(f'{name}_model.joblib')
        model_columns[name] = joblib.load(f'{name}_columns.joblib')
        print(f"✅ Model and columns for '{name}' loaded successfully.")
    except FileNotFoundError:
        print(f"⚠️ Model files for '{name}' not found. The '/predict/{name}' endpoint will be disabled.")
        # We don't add it to the dictionaries if it's not found
    except Exception as e:
        print(f"❌ Error loading model '{name}': {e}")

# --- GENERIC PREDICTION FUNCTION ---
def make_prediction(model_name):
    # 1. Check if the requested model is loaded
    if model_name not in models:
        return jsonify({'error': f"The '{model_name}' model is not available on the server."}), 503 # Service Unavailable

    try:
        # 2. Get data from the request
        json_data = request.get_json()
        if not json_data:
            return jsonify({'error': 'No input data provided.'}), 400

        # 3. Prepare the data for the model
        current_model_columns = model_columns[model_name]
        query_df = pd.DataFrame(json_data, index=[0])
        # Ensure the columns match the training order, filling missing with 0
        query_df = query_df.reindex(columns=current_model_columns, fill_value=0)

        # 4. Make a prediction
        model = models[model_name]
        prediction_raw = model.predict(query_df)
        result = int(prediction_raw[0])

        # 5. Return the result
        return jsonify({'prediction': result})

    except Exception as e:
        return jsonify({'error': f'An error occurred during prediction: {str(e)}'}), 500


# --- CREATE THE PREDICTION ROUTES ---
@app.route('/predict/breast_cancer', methods=['POST'])
def predict_breast_cancer():
    return make_prediction('breast_cancer')

@app.route('/predict/heart_disease', methods=['POST'])
def predict_heart_disease():
    return make_prediction('heart_disease')

@app.route('/predict/diabetes', methods=['POST'])
def predict_diabetes():
    return make_prediction('diabetes')

# --- HEALTH CHECK ROUTE (Good Practice) ---
@app.route('/', methods=['GET'])
def health_check():
    # Show which models were successfully loaded
    loaded_models = list(models.keys())
    return jsonify({
        "status": "API is running",
        "available_models": loaded_models
    })

# Run the app
if __name__ == '__main__':
    app.run(debug=True, port=5001)