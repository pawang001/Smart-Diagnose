# ==============================================================================
#  1. IMPORT NECESSARY LIBRARIES
# ==============================================================================
from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd

# ==============================================================================
#  2. INITIALIZE THE FLASK APPLICATION & CORS
# ==============================================================================
app = Flask(__name__)

# Configure Cross-Origin Resource Sharing (CORS)
allowed_origins = [
    "https://smart-diagnose.vercel.app",  # Your deployed frontend URL
    "http://localhost:5173"              # Your local development frontend URL
]
# Apply CORS settings to all routes starting with /predict/
CORS(app, resources={r"/predict/*": {"origins": allowed_origins}})

# ==============================================================================
#  3. LOAD THE TRAINED MACHINE LEARNING MODELS
# ==============================================================================
models = {}
model_columns = {}
model_names = ['breast_cancer', 'heart_disease', 'diabetes']

print("--- Loading Machine Learning Models ---")
for name in model_names:
    try:
        models[name] = joblib.load(f'{name}_model.joblib')
        model_columns[name] = joblib.load(f'{name}_columns.joblib')
        print(f"✅ Model '{name}' loaded successfully.")
    except FileNotFoundError:
        print(f"⚠️ WARNING: Model files for '{name}' not found. This endpoint will be disabled.")
    except Exception as e:
        print(f"❌ ERROR loading model '{name}': {e}")
print("---------------------------------------")

# ==============================================================================
#  4. DEFINE THE CORE PREDICTION LOGIC
# ==============================================================================
def make_prediction(model_name):
    """
    A generic function that handles the prediction logic for any given model.
    """
    if model_name not in models:
        return jsonify({'error': f"The '{model_name}' model is not available."}), 503

    try:
        json_data = request.get_json()
        if not json_data:
            return jsonify({'error': 'No input data provided.'}), 400

        input_df = pd.DataFrame(json_data, index=[0])
        required_columns = model_columns[model_name]
        
        # One-hot encode categorical features to match training columns
        query_df_processed = pd.get_dummies(input_df)
        query_df = query_df_processed.reindex(columns=required_columns, fill_value=0)

        model = models[model_name]
        prediction_raw = model.predict(query_df)
        result = int(prediction_raw[0])

        if hasattr(model, 'predict_proba'):
            probability = model.predict_proba(query_df)[0][1]
        else:
            probability = 0.95

        return jsonify({'prediction': result, 'probability': probability})

    except Exception as e:
        print(f"❌ An error occurred during prediction for {model_name}: {e}")
        return jsonify({'error': f'An error occurred during prediction: {str(e)}'}), 500

# ==============================================================================
#  5. CREATE THE API ROUTES (ENDPOINTS)
# ==============================================================================
@app.route('/predict/breast_cancer', methods=['POST'])
def predict_breast_cancer():
    return make_prediction('breast_cancer')

@app.route('/predict/heart_disease', methods=['POST'])
def predict_heart_disease():
    return make_prediction('heart_disease')

@app.route('/predict/diabetes', methods=['POST'])
def predict_diabetes():
    return make_prediction('diabetes')

@app.route('/', methods=['GET'])
def health_check():
    return jsonify({
        "status": "API is running",
        "available_models": list(models.keys())
    })

# ==============================================================================
#  6. RUN THE FLASK APPLICATION
# ==============================================================================
if __name__ == '__main__':
    app.run(debug=False, port=5001)
